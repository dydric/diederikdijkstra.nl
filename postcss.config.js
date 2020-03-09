const postcssPresetEnv = require('postcss-preset-env');
const cssnano = require('cssnano');
const purgecss = require('@fullhuman/postcss-purgecss');

console.log("!!!!!!!!!!!!!!!! " + process.env.ELEVENTY_ENV);

module.exports = {
  plugins: [
    require('postcss-import'),
    postcssPresetEnv({
      browsers: 'last 2 versions',
      stage: 3,
      features: {
        'nesting-rules': true
      }
    }),
    require('tailwindcss'),
    require('postcss-nested'),
    require('autoprefixer'),

    process.env.ELEVENTY_ENV === 'production' ?
      cssnano({ preset: 'default' })
      : null,

    process.env.ELEVENTY_ENV === 'production' ?
      purgecss({
        content: ["dist/**/*.html", "dist/**/*.js"],
        css: ["src/_includes/css/app.compiled.css"],
        whitelist: ['body', 'emoji', 'js-audio'],
        extractors: [{
          extractor: class TailwindCSS {
            static extract(content) {
              return content.match(/[\w-/.:]+(?<!:)/g) || [];
            }
          },
          extensions: ["html", "js"]
        }]
      })
      : null
  ]
}
