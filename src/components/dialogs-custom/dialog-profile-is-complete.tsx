import { Dispatch, SetStateAction } from 'react';
import { useTranslations } from 'next-intl';

import { CircleCheck } from 'lucide-react';

import DialogBasic from '@/components/ui/dialog/dialog-basic';
import TextWithLineBreaks from '@/components/ui/text-with-line-breaks';

const DialogProfileIsComplete = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}) => {
  const t = useTranslations();

  return (
    <DialogBasic isOpen={show} setIsOpen={setShow} title={t('congrats')} trigger={null}>
      <div className="flex min-h-[30vh] flex-col items-center justify-center gap-5 text-center">
        <div className="text-c42green">
          <CircleCheck size={60} className="smooth42transition hover:scale-150" />
        </div>
        <TextWithLineBreaks text={t('profile-is-complete')} />
      </div>
    </DialogBasic>
  );
};

export default DialogProfileIsComplete;
