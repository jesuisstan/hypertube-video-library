import { ReactNode, useRef, useState } from 'react';

import { motion } from 'framer-motion';

const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 50;

const CHARS = '!@#$%^&*():{};|,.<>/?';

const EncryptButton = ({
  text,
  onClick,
  Icon,
}: {
  text: string;
  onClick?: () => void;
  Icon?: ReactNode;
}) => {
  const displayText = text && text.length > 0 ? text : 'Press';

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [currentText, setCurrentText] = useState(displayText);

  const scramble = () => {
    let pos = 0;

    intervalRef.current = setInterval(() => {
      const scrambled = displayText
        .split('')
        .map((char, index) => {
          if (pos / CYCLES_PER_LETTER > index) {
            return char;
          }

          const randomCharIndex = Math.floor(Math.random() * CHARS.length);
          const randomChar = CHARS[randomCharIndex];

          return randomChar;
        })
        .join('');

      setCurrentText(scrambled);
      pos++;

      if (pos >= displayText.length * CYCLES_PER_LETTER) {
        stopScramble();
      }
    }, SHUFFLE_TIME);
  };

  const stopScramble = () => {
    clearInterval(intervalRef.current || undefined);

    setCurrentText(displayText);
  };

  return (
    <motion.button
      //whileHover={{
      //  scale: 1.025,
      //}}
      //whileTap={{
      //  scale: 0.975,
      //}}
      onMouseEnter={scramble}
      onMouseLeave={stopScramble}
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-md bg-neutral-700 px-4 py-2 font-mono font-medium uppercase text-neutral-300 ring-offset-background transition-colors hover:text-[#01a2a4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    >
      <div className="relative z-10 flex items-center gap-2">
        {Icon}
        <span>{currentText}</span>
      </div>

      <motion.span
        initial={{
          y: '100%',
        }}
        animate={{
          y: '-100%',
        }}
        transition={{
          repeat: Infinity,
          repeatType: 'mirror',
          duration: 1,
          ease: 'linear',
        }}
        className="absolute inset-0 z-0 bg-gradient-to-t from-[#01a2a4]/0 from-40% via-[#01a2a4]/100 to-[#01a2a4]/0 to-60% opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </motion.button>
  );
};

export default EncryptButton;
