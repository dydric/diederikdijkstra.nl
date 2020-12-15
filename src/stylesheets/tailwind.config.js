const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

const round = (num) =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, '$1')
    .replace(/\.0$/, '')
const rem = (px) => `${round(px / 16)}rem`
const em = (px, base) => `${round(px / base)}em`

// let enablePurge = false;
// if ( process.env.ELEVENTY_PRODUCTION ) {
//   let enablePurge = true;
// }

module.exports = {
  darkMode: 'class',
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    enabled: ((process.env.NODE_ENV === 'production') ? true : false),
    content: ["_site/**/*.html"],
    options: {
      whitelist: [],
    },
  },
  theme: {
    extend: {
      colors: {
        gray: colors.trueGray
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },

      typography: (theme) => ({
        DEFAULT: {
          css: [{
            color: theme('colors.gray.600'),
            fontWeight: '500',

            '[class~="lead"]': {
              color: theme('colors.gray.600'),
            },

            a: {
              color: theme('colors.pink.500'),
              fontWeight: '700',

              '&:hover': {
                color: theme('colors.pink.600'),
              },
            },

            p: {
              marginTop: em(16, 12),
              marginBottom: em(16, 12),
            },

            strong: {
              color: theme('colors.gray.700'),
            },

            hr: {
              borderColor: theme('colors.gray.200'),
              borderTopWidth: 2,
            },

            'ol > li::before': {
              color: theme('colors.pink.400'),
              fontWeight: '800',
            },

            'ul > li::before': {
              backgroundColor: theme('colors.pink.400'),
            },

            blockquote: {
              fontWeight: '600',
              color: theme('colors.gray.600'),
              borderLeftColor: theme('colors.pink.400'),
            },

            'figure figcaption': {
              color: theme('colors.gray.400'),
            },

            h1: {
              color: theme('colors.gray.900'),
              fontWeight: '900',
            },

            h2: {
              color: theme('colors.gray.900'),
              fontWeight: '800',
              marginTop: em(32, 24),
              marginBottom: em(16, 32),
            },

            h3: {
              marginTop: em(16, 32),
              marginBottom: em(12, 24),
              color: theme('colors.gray.900'),
              fontWeight: '700',
            },

            h4: {
              color: theme('colors.gray.800'),
            },

            code: {
              color: theme('colors.purple.500'),
            },

            'a code': {
              color: theme('colors.purple.500'),
            },

            pre: {
              color: theme('colors.gray.600'),
              backgroundColor: theme('colors.white'),
              borderColor: theme('colors.gray.200'),
              borderWidth: 2,
            },
          }],
        },
        dark: {
          css: [{
            color: theme('colors.gray.400'),
            fontWeight: '500',

            '[class~="lead"]': {
              color: theme('colors.gray.400'),
            },

            a: {
              color: theme('colors.pink.500'),
              '&:hover': {
                color: theme('colors.pink.600'),
              },
            },

            strong: {
              color: theme('colors.gray.300'),
            },

            hr: {
              borderColor: theme('colors.gray.700'),
            },

            'ol > li::before': {
              color: theme('colors.pink.800'),
            },

            'ul > li::before': {
              backgroundColor: theme('colors.pink.800'),
            },

            blockquote: {
              color: theme('colors.gray.200'),
              borderLeftColor: theme('colors.pink.800'),
            },

            'figure figcaption': {
              color: theme('colors.gray.400'),
            },

            h1: {
              color: theme('colors.gray.50'),
            },

            h2: {
              color: theme('colors.gray.50'),
              fontWeight: '800',
            },

            h3: {
              color: theme('colors.gray.50'),
              fontWeight: '600',
            },

            h4: {
              color: theme('colors.gray.100'),
            },

            code: {
              color: theme('colors.purple.500'),
            },

            'a code': {
              color: theme('colors.purple.500'),
            },

            'pre code': {
              color: theme('colors.gray.400'),
            },

            pre: {
              color: theme('colors.gray.400'),
              backgroundColor: theme('colors.gray.800'),
              borderColor: theme('colors.gray.700'),
            },
          }],
        },
        lg: {
          css: [{
            p: {
              marginTop: em(16, 12),
              marginBottom: em(16, 12),
            },
            h2: {
              marginTop: em(32, 24),
              marginBottom: em(16, 32),
            },
            h3: {
              marginTop: em(16, 32),
              marginBottom: em(12, 24),
            },
          }],
        },
        xl: {
          css: [{
            p: {
              marginTop: em(16, 12),
              marginBottom: em(16, 12),
            },
            h2: {
              marginTop: em(32, 24),
              marginBottom: em(16, 32),
            },
            h3: {
              marginTop: em(16, 32),
              marginBottom: em(12, 24),
            },
          }],
        },
      }),

    },
  },
  variants: {
    borderWidth: ['first'],
    typography: ['responsive', 'dark'],
    opacity: ['group-hover', 'group-focus'],
    backgroundOpacity: ['dark']
  },
  plugins: [
    require('@tailwindcss/typography')(),
  ],
};
