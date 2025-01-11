export const slideFromBottom = {
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 }, scale: 1 },
  hidden: { opacity: 0, y: 20 },
};

// Framer motion
export const framerMotion = {
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.2,
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      when: 'afterChildren',
    },
  },
};
