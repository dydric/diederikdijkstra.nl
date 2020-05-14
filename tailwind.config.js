const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  prefix: '',
  important: false,
  separator: ':',
  theme: {

    extend: {

      colors: {

        gray: {
          100: '#f7fafc',
          200: '#edf2f7',
          300: '#e2e8f0',
          400: '#cbd5e0',
          500: '#a0aec0',
          600: '#718096',
          700: '#4a5568',
          800: '#2d3748',
          900: '#1a202c',
        },

        accent: {
          'primary': 'var(--color-accent-primary)',
          'secondary': 'var(--color-accent-secondary)'
        },
      },

      backgroundColor: theme => ({
        'body': 'var(--color-body-background)',
        'card': 'var(--color-card-background)',
        button: {
          'primary': 'var(--color-button-primary-background)',
          'secondary': 'var(--color-button-secondary-background)',
        }
      }),

      borderColor: theme => ({
        default: theme('colors.gray.300', 'currentColor'),
        'card': 'var(--color-border-card)',
        'primary': 'var(--color-border-primary)',
        'secondary': 'var(--color-button-secondary)',
      }),

      textColor: theme => ({
        ...theme('colors'),
        'body': 'var(--color-text-body)',
        'headline': 'var(--color-text-headline)',
        'subheadline': 'var(--color-text-subheadline)',
        'caption': 'var(--color-text-caption)',
        'meta': 'var(--color-text-meta)',
        'button-primary': 'var(--color-button-primary-text)',
        'button-secondary': 'var(--color-button-secondary-text)'
      }),

      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },

      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem',
        '7xl': '5rem',
        '8xl': '6rem',
      },

      inset: {
        '50': '50%',
      },

      maxWidth: {
        xs: '20rem',
        sm: '24rem',
        md: '28rem',
        lg: '32rem',
        xl: '36rem',
        '2xl': '42rem',
        '3xl': '48rem',
        '4xl': '56rem',
        '5xl': '64rem',
        '6xl': '72rem',
        '7xl': '96rem',
        '8xl': '108rem',
      },
    },

  },
  variants: {},
  corePlugins: {},
  plugins: [
    require('@tailwindcss/ui'),
  ],
}
