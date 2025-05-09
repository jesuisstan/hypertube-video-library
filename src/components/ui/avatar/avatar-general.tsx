import * as Avatar from '@radix-ui/react-avatar';
import clsx from 'clsx';
import { PencilLine } from 'lucide-react';

import { formatUserNameOneLetter } from '@/utils/format-string';

const AvatarGeneral = ({
  src,
  nickname,
  rounded,
  width,
  height,
  onAvatarChange,
}: {
  src: string | undefined;
  nickname: string;
  rounded?: boolean;
  width?: number;
  height?: number;
  onAvatarChange?: () => void;
}) => {
  const avatarSizeStyle = {
    width: width || 50,
    height: height || 50,
  };

  return (
    <div className="group relative" style={avatarSizeStyle}>
      <Avatar.Root
        className={clsx(
          'border-foreground bg-foreground inline-flex cursor-pointer items-center justify-center overflow-hidden border-2 align-middle select-none',
          rounded ? 'rounded-full' : 'rounded-2xl'
        )}
        style={avatarSizeStyle}
        onClick={onAvatarChange}
      >
        <Avatar.Image
          className="h-full w-full rounded-[inherit] object-cover"
          src={src}
          alt={nickname}
        />
        <Avatar.Fallback className="bg-foreground text-card flex h-full w-full items-center justify-center text-base">
          {nickname && formatUserNameOneLetter(nickname)}
        </Avatar.Fallback>
      </Avatar.Root>
      <button
        onClick={onAvatarChange}
        className="text-muted-foreground bg-foreground/60 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: 'none' }}
      >
        <PencilLine className="text-background h-6 w-6" />
      </button>
    </div>
  );
};

export default AvatarGeneral;
