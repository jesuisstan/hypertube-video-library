import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { User as TUser } from 'next-auth';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

import * as Avatar from '@radix-ui/react-avatar';
import clsx from 'clsx';
import { CircleAlert, MapPinned, MapPinOff, Save } from 'lucide-react';

import ImageUploader from '@/components/avatar/avatar-uploader/image-uploader';
import DialogBasic from '@/components/dialogs-custom/dialog-basic';
import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import FilledOrNot from '@/components/ui/filled-or-not';
import { Label } from '@/components/ui/label';
import { RequiredInput } from '@/components/ui/required-input';
import SelectSingle from '@/components/ui/select-dropdown/select-single';
import TextWithLineBreaks from '@/components/ui/text-with-line-breaks';
import { allLanguagesOptions } from '@/constants/all-languages-ISO-639-1';
import { getFlag } from '@/constants/popular-languages';
import useUpdateSession from '@/hooks/useUpdateSession';
import useUserStore from '@/stores/user';
import { TGeoCoordinates, TSelectGeoOption } from '@/types/geolocation';
import {
  createTGeoCoordinates,
  createTSelectGeoOption,
  getFakeLocation,
  loadCityOptions,
  reverseGeocode,
} from '@/utils/geolocation-handlers';
import { getLanguageName } from '@/utils/language';
import { isProfileCategoryFilled } from '@/utils/user-handlers';

const MIN_DESCRIPTION_LENGTH = 42;
const MAX_DESCRIPTION_LENGTH = 442;

export type TProfileCompleteLayout =
  | 'basics'
  | 'description'
  | 'location'
  | 'photos'
  | 'preferred_language';

const DialogProfileModify = ({
  show,
  setShow,
  startLayout,
}: {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  startLayout: TProfileCompleteLayout;
}) => {
  const { updateSession } = useUpdateSession();
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'ru' | 'fr';
  const user = useUserStore((state) => state.user);
  const [layout, setLayout] = useState<TProfileCompleteLayout>(startLayout ?? 'photos');
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [description, setDescription] = useState(user?.biography || '');
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferred_language || '');

  // Location vars
  const [selectedCityOption, setSelectedCityOption] = useState<TSelectGeoOption | null>(
    createTSelectGeoOption(user?.address)
  );
  const [geoCoordinates, setGeoCoordinates] = useState<TGeoCoordinates | null>(
    createTGeoCoordinates(user?.latitude, user?.longitude)
  );

  // Determine the correct language options array based on the locale
  const languageOptions = allLanguagesOptions.map((lang) => ({
    value: lang.value,
    label: getLanguageName(lang.value, locale),
  }));

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    if (text.length <= MAX_DESCRIPTION_LENGTH) {
      setDescription(text);
    } else {
      setDescription(text.substring(0, MAX_DESCRIPTION_LENGTH));
    }
  };

  const handleFakeLocatorClick = () => {
    setError('');
    setSuccessMessage('');
    const fakeLocation = getFakeLocation(locale);
    setGeoCoordinates({ lat: fakeLocation.latitude, lng: fakeLocation.longitude });
    setSelectedCityOption({ value: fakeLocation.address, label: fakeLocation.address });
  };

  const getGeoCoordinates = async (address: string) => {
    setError('');
    try {
      const response = await fetch(`/api/location-proxy?input=${address}&type=geocode`);
      const data = await response.json();
      const location = data?.results[0]?.geometry?.location;
      return location || null;
    } catch (error) {
      setError(t('error-getting-geolocation'));
      return null;
    }
  };

  const handleGeoLocatorClick = async () => {
    setError('');
    setSuccessMessage('');
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setGeoCoordinates({ lat: latitude, lng: longitude });
          const locationData = await reverseGeocode(latitude, longitude, setError, t);
          if (locationData) setSelectedCityOption(locationData.city);
        },
        (error) => {
          setError(t('error-getting-location'));
        }
      );
    } else {
      setError(t('geolocation-not-supported'));
    }
    setLoading(false);
  };

  // GEO SELECTOR STYLES
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: '#18181b',
      borderColor: state.isFocused ? '#01a2a4' : '#27272a',
      color: '#f4f4f5', // text-foreground
      boxShadow: state.isFocused ? '0 0 0 1px #01a2a4' : 'none',
      minHeight: 40,
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: '#18181b', // bg-card
      color: '#f4f4f5', // text-foreground
      zIndex: 100,
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#01a2a4'
        : state.isFocused
          ? '#27272a' // bg-muted
          : '#18181b', // bg-card
      color: state.isSelected ? '#fff' : '#f4f4f5',
      cursor: 'pointer',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#f4f4f5', // text-foreground
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#a1a1aa', // text-muted-foreground
    }),
    input: (provided: any) => ({
      ...provided,
      color: '#f4f4f5', // text-foreground
    }),
    dropdownIndicator: (provided: any, state: any) => ({
      ...provided,
      color: state.isFocused ? '#01a2a4' : '#a1a1aa',
    }),
    indicatorSeparator: (provided: any) => ({
      ...provided,
      backgroundColor: '#27272a', // border-muted
    }),
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    const currentForm = formRef.current;
    if (!currentForm) return;

    const formData = new FormData(currentForm);
    //const data = Object.fromEntries(formData.entries());

    // create body for request:
    let body: any = {};
    if (layout === 'basics') {
      body = JSON.stringify({
        category: 'basics',
        firstname: formData.get('firstname'),
        lastname: formData.get('lastname'),
        nickname: formData.get('nickname'),
        birthdate: formData.get('birthdate'),
      });
    } else if (layout === 'description') {
      body = JSON.stringify({
        category: 'description',
        description: description,
      });
    } else if (layout === 'location') {
      body = JSON.stringify({
        category: 'location',
        latitude: geoCoordinates?.lat,
        longitude: geoCoordinates?.lng,
        address: selectedCityOption?.label,
      });
    } else if (layout === 'preferred_language') {
      body = JSON.stringify({
        category: 'preferred_language',
        preferred_language: preferredLanguage,
      });
    }

    let response: any;
    try {
      response = await fetch(`/api/users/${user?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });

      const result = await response.json();
      const updatedUserData: TUser = result.user;

      if (response.ok) {
        setSuccessMessage(t(result.message));
        if (updatedUserData) {
          //setUser({ ...user, ...updatedUserData });
          await updateSession(updatedUserData);
        }
      } else {
        setError(t(result.error));
      }
    } catch (error) {
      setError(t(error as string));
    } finally {
      setLoading(false);
    }
  };

  const layouts = {
    basics: (
      <div
        id="basics"
        className={clsx(
          'flex flex-col items-center justify-center self-center align-middle',
          `sm:flex-row sm:items-center sm:justify-center sm:space-y-0 sm:space-x-10 sm:self-center sm:align-middle`
        )}
      >
        <div className="flex flex-col self-start">
          <div className="flex flex-col">
            <Label htmlFor="firstname" className="mb-2">
              {t(`firstname`)}
            </Label>
            <RequiredInput
              type="text"
              id="firstname"
              name="firstname"
              placeholder={t(`firstname`)}
              pattern="^[A-Za-z\-]{1,21}$"
              maxLength={21}
              errorMessage={t('auth.max-char') + ' 21: a-Z, -'}
              value={user?.firstname}
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="lastname" className="mb-2">
              {t(`lastname`)}
            </Label>
            <RequiredInput
              type="text"
              id="lastname"
              name="lastname"
              placeholder={t('lastname')}
              pattern="^[A-Za-z\-]{1,21}$"
              maxLength={21}
              errorMessage={t('auth.max-char') + ' 21: a-Z, -'}
              value={user?.lastname}
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="nickname" className="mb-2">
              {t(`nickname`)}
            </Label>
            <RequiredInput
              type="text"
              id="nickname"
              name="nickname"
              placeholder={t(`nickname`)}
              pattern="^[A-Za-z0-9\-@]{1,21}$"
              maxLength={21}
              errorMessage={t('auth.max-char') + ' 21: a-Z 0-9 - @'}
              value={user?.nickname}
            />
          </div>
        </div>
      </div>
    ),
    description: (
      <div>
        <div className="flex flex-col">
          <textarea
            id="description"
            name="description"
            placeholder={t(`describe-youself`)}
            className="disabled:opacity-50, bg-input ring-offset-background focus-visible:ring-primary m-1 flex h-48 min-w-[36vw] rounded-md border p-2 text-sm focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:outline-none disabled:cursor-not-allowed"
            value={description}
            onChange={handleDescriptionChange}
          />
          <span className="text-muted-foreground/80 mt-1 ml-2 text-xs">
            {t('min') + ' ' + MIN_DESCRIPTION_LENGTH}
            {', '}
            {t('max') + ' ' + MAX_DESCRIPTION_LENGTH} {t('characters')}
          </span>
        </div>
      </div>
    ),
    location: (
      <div className="flex flex-col">
        <div id="geolocation" className="m-5 flex flex-col self-center">
          <div className="mb-2 flex flex-row items-center justify-center gap-5">
            <div id="geo-locator" className="self-center" title={t('get-location')}>
              <MapPinned
                size={24}
                onClick={handleGeoLocatorClick}
                className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-110"
              />
            </div>
            <p className="text-muted-foreground">{' / '}</p>
            {/* fake location */}
            <div id="geo-locator" className="self-center" title={t('set-fake-location')}>
              <MapPinOff
                size={24}
                onClick={handleFakeLocatorClick}
                className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-110"
              />
            </div>
          </div>
          {/* city selector */}
          <div id="geo-selector" className="mt-2">
            <div className="w-full">
              <Label htmlFor="city" className="mb-2">
                {t(`city`)}
              </Label>
              <AsyncSelect
                styles={customStyles}
                className="w-52 cursor-pointer text-xs"
                value={selectedCityOption}
                onChange={setSelectedCityOption}
                loadOptions={(input) => loadCityOptions(input, setError, t)}
                id="city"
                placeholder={t('selector.select-city')}
                required
              />
            </div>
          </div>
        </div>
        {/* warning */}
        <div className="flex max-w-full flex-row items-center justify-center gap-3 space-y-1 self-center text-center">
          <div className="text-c42orange">
            <CircleAlert size={25} />
          </div>
          <div className="max-w-96 text-xs text-pretty">
            <TextWithLineBreaks text={t('location-need-message')} />
          </div>
        </div>
      </div>
    ),
    preferred_language: (
      <div className="flex flex-col">
        <div className="flex flex-col items-center justify-center gap-2">
          <Avatar.Root
            className={
              'border-foreground bg-foreground inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 align-middle select-none'
            }
          >
            <Avatar.Image
              className="h-5 w-5 rounded-[inherit] object-cover"
              src={`/country-flags/${getFlag(getLanguageName(preferredLanguage, locale), locale)?.toLowerCase()}.svg`}
              alt="national-flag"
            />
          </Avatar.Root>
          <SelectSingle
            options={languageOptions}
            defaultValue="en"
            selectedItem={preferredLanguage}
            setSelectedItem={(value) => setPreferredLanguage(value.toLocaleLowerCase())}
          />
        </div>
      </div>
    ),
    photos: (
      <div className="flex">
        <ImageUploader id={0} />
      </div>
    ),
  };

  const handleClose = () => {
    setError('');
    setSuccessMessage('');
    setShow(false);
  };

  const handleNext = () => {
    setError('');
    setSuccessMessage('');
    switch (layout) {
      case 'basics':
        setLayout('description');
        break;
      case 'description':
        setLayout('location');
        break;
      case 'location':
        setLayout('preferred_language');
        break;
      case 'preferred_language':
        setLayout('photos');
        break;
      case 'photos':
        handleClose();
        break;
      default:
        break;
    }
  };

  const handlePrevious = () => {
    setError('');
    setSuccessMessage('');
    switch (layout) {
      case 'description':
        setLayout('basics');
        break;
      case 'location':
        setLayout('description');
        break;
      case 'preferred_language':
        setLayout('location');
        break;
      case 'photos':
        setLayout('preferred_language');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (show) {
      setLayout(startLayout ?? 'basics');
    }
  }, [show, startLayout]);

  useEffect(() => {
    // Get geolocation for selected home city
    if (layout !== 'location') return;
    let isMounted = true;
    const fetchData = async () => {
      if (selectedCityOption) {
        const geoLocation = await getGeoCoordinates(selectedCityOption.value);
        if (isMounted) {
          setGeoCoordinates(geoLocation);
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCityOption]);

  return (
    <DialogBasic
      isOpen={show}
      setIsOpen={handleClose}
      title={t('complete-profile')}
      trigger={null}
      description={t(`dialog-title.${layout}`)}
    >
      <div className="flex flex-row items-center gap-2">
        <p className="text-xs italic">{t('category-filled-?')}</p>
        <FilledOrNot size={18} filled={isProfileCategoryFilled(layout, user)} />
      </div>
      <div className="max-h-[70vh] overflow-y-auto">
        <div
          className={clsx(
            'flex h-max min-h-[20vh] min-w-[30vw] flex-col items-center justify-center space-y-10 text-center'
          )}
        >
          {layout !== 'photos' ? (
            <form
              className="align-center flex flex-col items-center justify-center gap-5 text-left"
              onSubmit={handleSubmit}
              ref={formRef}
            >
              {layouts[layout as keyof typeof layouts]}
              <ButtonCustom
                type="submit"
                size="default"
                disabled={!user || loading}
                title={t('save')}
                loading={loading}
                className="min-w-32"
              >
                <div className="flex flex-row items-center space-x-3">
                  <div>
                    <Save size={20} />
                  </div>
                  <span>{t('save')}</span>
                </div>
              </ButtonCustom>
            </form>
          ) : (
            <div>{layouts[layout as keyof typeof layouts]}</div>
          )}
        </div>
        <div className="min-h-6">
          {error && <p className="text-destructive mb-5 text-center text-sm">{error}</p>}
          {successMessage && (
            <p className="text-positive mb-5 text-center text-sm">{successMessage}</p>
          )}
        </div>
      </div>

      {/* Next and Previous buttons */}
      <div
        className={clsx(
          'xs:flex-row flex flex-col items-center gap-2',
          layout === 'basics' ? 'justify-end' : 'justify-between'
        )}
      >
        {layout !== 'basics' && (
          <ButtonCustom
            type="button"
            variant="default"
            onClick={handlePrevious}
            className="min-w-32"
            disabled={loading}
          >
            {t('back')}
          </ButtonCustom>
        )}
        <ButtonCustom
          type="button"
          variant="default"
          onClick={handleNext}
          className="min-w-32"
          disabled={loading}
        >
          {layout !== 'photos' ? t('next') : t('finish')}
        </ButtonCustom>
      </div>
    </DialogBasic>
  );
};

export default DialogProfileModify;
