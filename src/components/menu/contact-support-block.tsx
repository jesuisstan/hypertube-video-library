import { AtSign } from 'lucide-react';

const ContactSupportBlock = ({ translate }: { translate: (key: string) => string }) => {
  return (
    <div className="group ml-3 flex items-center gap-2 pb-5 text-xs text-muted-foreground">
      <AtSign size={16} />
      <a
        href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
        target="_blank"
        rel="noopener noreferrer"
        className="items-center text-muted-foreground smooth42transition hover:text-c42orange"
      >
        {translate(`contact-support`)}
      </a>
    </div>
  );
};

export default ContactSupportBlock;
