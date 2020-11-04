const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    extend: {

      // boxShadow: {
      //   softui: '20px 20px 60px rgba(0, 0, 0, .1), -20px -20px 60px rgba(255, 255, 255, .5)'
      // },

      colors: {

        champagne: {
          '50': '#fff7eb',
          '100': '#feeacd',
          '200': '#fed9a2',
          '300': '#fece86',
          '400': '#fdc168',
          // '500': '#fdb549',
          '500': '#fda421',
          '600': '#f29203',
          '700': '#ca7a02',
          '800': '#a16102',
          '900': '#8d5502',
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
          // '500': '#ff668e',
          '500': '#ff4777',
          '600': '#ff2960',
          '700': '#ff0a4a',
          '800': '#eb003d',
          '900': '#cc0035',
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

        'accent-primary': 'var(--color-accent-primary)',
        'accent-secondary': 'var(--color-accent-secondary)'
      },

      backgroundColor: theme => ({
        'primary': 'var(--color-bg-primary)',
        'secondary': 'var(--color-bg-secondary)',
        'button': 'var(--color-button-bg)',
        'button-hover': 'var(--color-button-bg-hover)',
        'tweet': 'var(--color-bg-tweet)',
        'tweet-hover': 'var(--color-bg-tweet-hover)',
      }),

      borderColor: theme => ({
        'primary': 'var(--color-border)',
        'accent': 'var(--color-border-accent)',
      }),

      textColor: theme => ({
        'body': 'var(--color-body-text)',
        'meta': 'var(--color-meta-text)',
        'headline': 'var(--color-headline)',
        'subheadline': 'var(--color-subheadline)',
        'quote': 'var(--color-quote)',
        'code': 'var(--color-code)',
        'site-title': 'var(--color-site-title)',
        'menu-link': 'var(--color-menu-link)',
        'menu-link-active': 'var(--color-menu-link-active)',
        'link': 'var(--color-link)',
        'link-hover': 'var(--color-link-hover)',
        'link-alt': 'var(--color-link-alt)',
        'link-alt-hover': 'var(--color-link-alt-hover)',
        'button': 'var(--color-button)',
        'button-hover': 'var(--color-button-hover)',
        'tweet': 'var(--color-tweet)',
      }),

      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },

      inset: {
        '50': '50%',
        '100': '100%',
      },

      opacity: {
        '90': '90%',
      },

      typography: (theme) => ({
        default: {
          css: {
            color: 'var(--color-body-text)',
            strong: 'var(--color-body-text)',
            h2: { color: 'var(--color-subheadline)'},
            h3: { color: 'var(--color-subheadline)'},
            h4: { color: 'var(--color-subheadline)'},
            blockquote: { color: 'var(--color-quote)'},
            code: { color: 'var(--color-code)'},
            a: {
              color: 'var(--color-link)',
              '&:hover': {
                color: 'var(--color-link-hover)',
              },
            },
          },
        },
      }),
    },
  },
  variants: {
    textDecoration: ['responsive', 'hover', 'focus', 'active', 'group-hover'],
    borderColor: ['responsive', 'hover', 'focus', 'focus-within']
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/ui'),
  ],
};
