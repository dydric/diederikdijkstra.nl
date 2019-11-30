const postcssPresetEnv = require('postcss-preset-env');
const cssnano = require('cssnano');
const purgecss = require('@fullhuman/postcss-purgecss');


console.log("!!!!!!!!!!!!!!!! " + process.env.ELEVENTY_ENV);

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
    require('autoprefixer'),

    process.env.ELEVENTY_ENV === 'production' ?
      cssnano({ preset: 'default' })
      : null,

    process.env.ELEVENTY_ENV === 'production' ?
      purgecss({
        content: ["dist/**/*.html", "dist/**/*.js"],
        css: ["src/static/app.compiled.css"],
        whitelist: ['body', 'emoji'],
        extractors: [{
          extractor: class TailwindCSS {
            static extract(content) {
              return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
            }
          },
          extensions: ["html", "js"]
        }]
      })
      : null
  ]
}
