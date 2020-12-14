module.exports = {
  plugins: [
    require('postcss-import'),
    require(`tailwindcss`)(`./src/stylesheets/tailwind.config.js`),
    require('postcss-preset-env')({ stage: 1 }),
    require('postcss-nested'),
    require(`autoprefixer`),
    ...(process.env.NODE_ENV === "production" ? [
      require(`postcss-clean`)]
      : []),
  ],
};
