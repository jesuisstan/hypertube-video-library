import * as Avatar from '@radix-ui/react-avatar';
import clsx from 'clsx';

import { formatUserNameOneLetter } from '@/utils/format-string';

const AvatarMini = ({
  src,
  nickname,
  rounded,
  width,
  height,
}: {
  src: string | undefined;
  nickname: string;
  rounded?: boolean;
  width?: number;
  height?: number;
}) => (
  <Avatar.Root
    className={clsx(
      'border-foreground bg-foreground inline-flex items-center justify-center overflow-hidden border-[1px] align-middle select-none',
      rounded ? 'rounded-full' : 'rounded-md',
      width ? `w-${width}` : 'w-11',
      height ? `h-${height}` : 'h-11'
    )}
  >
    <Avatar.Image
      className="h-full w-full rounded-[inherit] object-cover"
      src={src}
      alt={nickname}
    />
    <Avatar.Fallback
      className="bg-foreground text-card flex h-full w-full items-center justify-center text-base"
      //delayMs={100}
    >
      {nickname && formatUserNameOneLetter(nickname)}
    </Avatar.Fallback>
  </Avatar.Root>
);

export default AvatarMini;
