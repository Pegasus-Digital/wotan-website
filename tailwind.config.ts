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
      padding: '2rem',
    },
    extend: {
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
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      backgroundImage: {
        wotan:
          'linear-gradient(106deg, rgba(204,15,75,1) 20%, rgba(119,54,93,1) 80%)',
        pattern: "url('/bg.png')",
      },
      boxShadow: {
        'wotan-light':
          '4px 4px 16px rgba(184, 184, 184, 1), -4px -4px 16px rgba(255, 255, 255, 1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config

export default config
