const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-nested'),
    postcssPresetEnv({
      browsers: 'last 2 versions',
      stage: 3,
      features: {
        'nesting-rules': true
      }
    }),
    require('tailwindcss'),
    require('autoprefixer')
  ]
}
