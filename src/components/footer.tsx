import { useTranslations } from 'next-intl';

const Footer = () => {
  const t = useTranslations();

  return (
    <div className="flex flex-row items-center self-end p-2 text-right text-xs font-normal leading-4 tracking-normal">
      <div>
        Hypertube Video Library {t(`rights-reserved`)}
        {'. '}
        {t(`service-provided`)}
        {/* TODO the link */}
        {/*<a
          href={`https://www.krivtsoff.site/`}
          target="_blank"
          className="my-6 text-center text-sm text-positive transition-all duration-300 ease-in-out hover:text-c42orange"
        >
          Stan Krivtsoff
        </a>*/}
        {' ' + t(`students-ecole-42`)}
        {'. '}
      </div>
    </div>
  );
};

export default Footer;
