import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { ArrowBigRight } from 'lucide-react';

import DrawerBasic from '@/components/ui/drawer-template';
import { TCastMember, TCrewMember } from '@/types/movies';

const Trigger = () => {
  const t = useTranslations();

  return (
    <div className="smooth42transition hover:text-c42orange flex w-32 cursor-pointer flex-row items-center justify-center gap-1">
      {t('all')}
      <>
        <ArrowBigRight className="h-4 w-4" />
      </>
    </div>
  );
};

const DrawerCredits = ({
  title,
  description,
  data,
}: {
  title: string;
  description: string;
  data: TCastMember[] | TCrewMember[];
}) => {
  return (
    <DrawerBasic
      trigger={<Trigger />}
      title={title}
      description={description}
      side="right"
      size="1/2"
    >
      <div className="flex w-full flex-col gap-4">
        <div key="credits" className="flex flex-wrap justify-center gap-5 p-2">
          {data.map((person, index) => (
            <div key={index} className="shadow-primary/20 flex w-32 flex-col p-1 shadow-md">
              <div
                className={'bg-muted flex justify-center overflow-hidden rounded-md align-middle'}
              >
                <Image
                  src={
                    person.profile_path
                      ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                      : '/icons/person.png'
                  }
                  alt={person.name}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="h-[192px] w-[128px] rounded-md object-cover"
                />
              </div>
              <p className="mt-2 text-center text-sm font-semibold">{person.name}</p>
              <p className="text-muted-foreground text-center text-xs">
                {'character' in person ? person.character : person.job}
              </p>
            </div>
          ))}
        </div>
      </div>
    </DrawerBasic>
  );
};

export default DrawerCredits;
