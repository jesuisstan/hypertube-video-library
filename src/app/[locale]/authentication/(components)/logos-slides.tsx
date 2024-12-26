import Image from 'next/image';

export const slides = [
  <Image
    key="slide-1"
    src="/identity/logo-title-only.png"
    blurDataURL="/identity/logo-title-only.png"
    alt="high-resolution-logo"
    placeholder="empty"
    priority
    className="max-h-[90%] max-w-[90%] object-contain"
    sizes="auto"
    style={{ width: 1000, height: 300 }}
    width={0}
    height={0}
  />,
  <Image
    key="slide-2"
    src="/identity/logo-square.png"
    blurDataURL="/identity/logo-square.png"
    alt="high-resolution-logo"
    placeholder="empty"
    priority
    className="max-h-[90%] max-w-[90%] object-contain"
    sizes="auto"
    style={{ width: 1000, height: 1000 }}
    width={0}
    height={0}
  />,
  <Image
    key="slide-3"
    src="/identity/hypertube-high-resolution-logo-transparent.png"
    blurDataURL="/identity/hypertube-high-resolution-logo-transparent.png"
    alt="high-resolution-logo"
    placeholder="empty"
    priority
    className="max-h-[90%] max-w-[90%] object-contain"
    sizes="auto"
    style={{ width: 3000, height: 1500 }}
    width={0}
    height={0}
  />,
];
