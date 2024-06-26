import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pegasus/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        tablet: '2rem',
        desktop: '4rem',
      },
    },
    extend: {
      gridTemplateColumns: {
        dashboard: 'minmax(18rem, 20rem) 1fr',
      },

      screens: {
        tablet: '768px',
        desktop: '1280px',
      },

      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        wotanRed: {
          50: '#FDE2EB',
          100: '#FBCBDA',
          200: '#F792B2',
          300: '#F35D8D',
          400: '#EF2465',
          500: '#CC0F4B',
          600: '#A20C3B',
          700: '#7C092D',
          800: '#51061E',
          900: '#2B0310',
          950: '#130107',
        },
        wotanPurple: {
          50: '#F4E6EE',
          100: '#EAD1E0',
          200: '#D6A4C2',
          300: '#BF73A1',
          400: '#A54B81',
          500: '#77365D',
          600: '#5F2B4A',
          700: '#462037',
          800: '#311626',
          900: '#190B13',
          950: '#0B0508',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'slide-down': {
          from: {
            height: '0px',
            opacity: '0',
            transform: 'translateY(-1rem)',
          },
        },
        'slide-up': {
          to: {
            height: '0px',
            opacity: '0',
            transform: 'translateY(-1rem)',
          },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-in-up': {
          from: { opacity: '0.25', transform: 'translateY(2rem)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.2s ease-out',
        'slide-down': 'slide-down 0.2s ease-out',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
      },
      backgroundImage: {
        wotan:
          'linear-gradient(106deg, rgba(204,15,75,1) 20%, rgba(119,54,93,1) 80%)',
        pattern: "url('/bg.png')",
        gift: "linear-gradient(81deg, #ca004cc7, #77365df5), url('/gift.jpg') ",
        footer:
          'radial-gradient(at 10% 87%, #651B479C 0px, transparent 50%), radial-gradient(at 98% 96%, hsla(337,73%,49%,1) 0px, transparent 50%), radial-gradient(at 90% 20%, #651B479C 0px, transparent 50%), radial-gradient(at 13% 21%, hsla(337,100%,39%,1) 0px, transparent 50%)',
      },
      boxShadow: {
        'wotan-light': '4px 4px 8px rgba(0, 0, 0, .2)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config

export default config
