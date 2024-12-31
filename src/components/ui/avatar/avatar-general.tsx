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
          'inline-flex cursor-pointer select-none items-center border-2 border-foreground justify-center overflow-hidden bg-foreground align-middle',
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
        <Avatar.Fallback className="flex h-full w-full items-center justify-center bg-foreground text-base text-card">
          {nickname && formatUserNameOneLetter(nickname)}
        </Avatar.Fallback>
      </Avatar.Root>
      <button
        onClick={onAvatarChange}
        className="
          absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1 text-muted-foreground
          opacity-0 transition-opacity duration-300 group-hover:opacity-100
        "
        style={{ boxShadow: 'none' }}
      >
        <PencilLine className="h-6 w-6 text-white" />
      </button>
    </div>
  );
};

export default AvatarGeneral;
