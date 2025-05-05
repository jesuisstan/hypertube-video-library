import { AtSign } from 'lucide-react';

const ContactSupportBlock = ({ translate }: { translate: (key: string) => string }) => {
  return (
    <div className="group text-muted-foreground ml-3 flex items-center gap-2 pb-5 text-xs">
      <AtSign size={16} />
      <a
        href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground smooth42transition hover:text-c42orange items-center"
      >
        {translate(`contact-support`)}
      </a>
    </div>
  );
};

export default ContactSupportBlock;
