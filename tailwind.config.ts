/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/not-found.tsx',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    screens: {
      xs: '480px',
      sm: '640px', // => @media (min-width: 640px)
      md: '900px', // => @media (min-width: 900px)
      lg: '1200px', // => @media (min-width: 1200px)
      xl: '1500px', // => @media (min-width: 1500px)
    },
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none', // remove max-width for prose
          },
        },
      },
      colors: {
        c42orange: 'hsl(var(--c42orange))',
        c42green: 'hsl(var(--c42green))',

        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        radius: 'hsl(var(--radius))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'fade-up-down': {
          '0%, 100%': { opacity: '1', transform: 'translateY(0)' },
          '50%': { opacity: '0.5', transform: 'translateY(10px)' },
        },
        'slide-up-down': {
          '0%': { transform: 'translateY(-100%)' },
          '50%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        'fade-up-down': 'fade-up-down 2s ease-in-out infinite',
        'slide-up-down': 'slide-up-down 6s ease-in-out infinite',
      },
    },
  },
  plugins: [
    function ({ addUtilities }: { addUtilities: Function }) {
      const newUtilities = {
        '.smooth42transition': {
          transition: 'all 300ms ease-in-out',
          transform: 'translateZ(0)',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
};
