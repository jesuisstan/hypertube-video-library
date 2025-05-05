import Image from 'next/image';

export const SLIDES = [
  <div
    key="slide1"
    className="smooth42transition m-3 mx-10 flex h-[60vh] w-[60vw] justify-center self-center lg:h-[70vh] lg:w-[70vw]"
  >
    <Image
      src="/identity/hypertube-high-resolution-logo-transparent.png"
      blurDataURL={'/identity/hypertube-high-resolution-logo-transparent.png'}
      alt="photo1"
      width={0}
      height={0}
      sizes="100vw"
      //className="h-auto w-full rounded-xl border-8 border-black"
      className="h-full w-full object-cover p-1"
      style={{ objectFit: 'contain', objectPosition: 'center' }} // Ensures image fits and is centered
      placeholder="blur"
      priority
    />
  </div>,
  <div
    key="slide2"
    className="smooth42transition m-3 mx-10 flex h-[60vh] w-[60vw] justify-center self-center lg:h-[70vh] lg:w-[70vw]"
  >
    <Image
      src="/identity/logo-title-only.png"
      blurDataURL={'/identity/logo-title-only.png'}
      alt="photo2"
      width={0}
      height={0}
      sizes="100vw"
      //className="h-auto w-full rounded-xl border-8 border-black"
      className="h-full w-full object-cover p-1"
      style={{ objectFit: 'contain', objectPosition: 'center' }} // Ensures image fits and is centered
      placeholder="blur"
      priority
    />
  </div>,
  <div
    key="slide3"
    className="smooth42transition m-3 mx-10 flex h-[60vh] w-[60vw] justify-center self-center md:h-[70vh] md:w-[70vw]"
  >
    <Image
      src="/identity/logo-square.png"
      blurDataURL={'/identity/logo-square.png'}
      alt="photo2"
      width={0}
      height={0}
      sizes="100vw"
      //className="h-auto w-full rounded-xl border-8 border-black"
      className="h-full w-full object-cover p-1"
      style={{ objectFit: 'contain', objectPosition: 'center' }} // Ensures image fits and is centered
      placeholder="blur"
      priority
    />
  </div>,
];
