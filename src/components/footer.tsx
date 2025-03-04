import { useTranslations } from 'next-intl';

const Footer = () => {
  const t = useTranslations();

  return (
    <div className="flex flex-row items-center self-end p-2 text-right text-xs font-normal leading-4 tracking-normal">
      <div>
        Hypertube Video Library {t(`rights-reserved`)}
        {'. '}
        {t(`service-provided`)}{' '}
        <a
          href={`https://www.krivtsoff.site/`}
          target="_blank"
          className="text-positive my-6 text-center text-sm transition-all duration-300 ease-in-out hover:text-c42orange"
        >
          Stan Krivtsoff
        </a>
        {'. '}
      </div>
    </div>
  );
};

export default Footer;
