const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    extend: {

      boxShadow: {
        softui: '20px 20px 60px rgba(0, 0, 0, .1), -20px -20px 60px rgba(255, 255, 255, .5)'
      },

      colors: {
        champagne: {
          '50': '#fff7eb',
          '100': '#feeacd',
          '200': '#fed9a2',
          '300': '#fece86',
          '400': '#fdc168',
          '500': '#fdb549',
          '600': '#fda421',
          '700': '#f29203',
          '800': '#ca7a02',
          '900': '#a16102',
        },
        lavender: {
          '50': '#f0ecfe',
          '100': '#e8e3fd',
          '200': '#dacefc',
          '300': '#c4b2fa',
          '400': '#a995f8',
          '500': '#9978f7',
          '600': '#845cf5',
          '700': '#6e3ff3',
          '800': '#5822f1',
          '900': '#440edd',
        },
        flamingo: {
          '50': '#fff0f4',
          '100': '#ffe0e8',
          '200': '#ffc5d4',
          '300': '#ffa3bb',
          '400': '#ff85a4',
          '500': '#ff668e',
          '600': '#ff4777',
          '700': '#ff2960',
          '800': '#ff0a4a',
          '900': '#eb003d',
        },
        sky: {
          '50': '#ebf9fe',
          '100': '#dcf4fe',
          '200': '#c2ebfd',
          '300': '#92dbfb',
          '400': '#6bcefa',
          '500': '#4dc5f9',
          '600': '#30bbf8',
          '700': '#12b1f7',
          '800': '#07a0e3',
          '900': '#068bc6',
        },
      },

      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },

      inset: {
        '50': '50%',
        '100': '100%',
      },

      typography: (theme) => ({
        default: {
          css: {
            color: theme('colors.gray.800'),
            a: {
              color: theme('colors.lavender.600'),
              '&:hover': {
                color: theme('colors.lavender.800'),
              },
            },
          },
        },
      }),
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/ui'),
  ],
};
