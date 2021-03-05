module.exports = {

  plugins: [
    require('postcss-import'),
    require(`tailwindcss`)(`./src/stylesheets/tailwind.config.js`),
    // process.env.ELEVENTY_PRODUCTION ? require('postcss-preset-env')({ stage: 3 }) : false,
    require('postcss-nested'),
    process.env.ELEVENTY_PRODUCTION ? require(`autoprefixer`) : false
  ],
};
