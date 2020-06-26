module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-preset-env')({
      browsers: 'last 2 versions',
      stage: 3,
      features: {
        'nesting-rules': true
      }
    }),
    require(`tailwindcss`)(`./tailwind.config.js`),
    require('postcss-nested'),
    require(`autoprefixer`),
    ...(process.env.ELEVENTY_PRODUCTION
      ? [
          require(`postcss-clean`),
          require(`@fullhuman/postcss-purgecss`)({
            content: ["_site/**/*.html"],
            defaultExtractor: (content) =>
              content.match(/[\w-/:]+(?<!:)/g) || [],
            whitelist: ['body', 'emoji'],
            whitelistPatterns: [/body/],
          }),
        ]
      : []),
  ],
};
