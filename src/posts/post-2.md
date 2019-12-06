---
title: Blanco
date: 2019-11-29
featured_image:
image_caption:
excerpt: Vandaag mijn site compleet vernieuwd, alle bestanden verwijderd en opnieuw ingericht op basis van deze <a href="https://github.com/chrisssycollins/web-starter">Web Starter</a>.
tags:
  - post
  - redesign
---

De indeling is eenvoudig en werkt mega-snel 🏎💨. Perfect om als basis te gebruiken. Daarnaast maakt het gebruik van een opzet die ik niet gewend ben. Zo maakt deze 'starter' geen gebruik van `Gulp` en `Sass`. Dit leek me wel interessant om mee te beginnen.

Voor het genereren van de stylesheets maakt het gebruik van `TailWindCSS` en `PostCSS`. [Tailwind](https://tailwindcss.com/) ken ik goed. Ik gebruik het al redelijk lang. Het werkt erg prettig en is ideaal om websites (snel) mee op te zetten.

[PostCSS](https://postcss.org/) is wel redelijk nieuw voor me. Ik gebruik eigenlijk altijd [Sass](https://sass-lang.com/). Er zit nog bijna geen styling op deze website, maar ik heb PostCSS al wel redelijk naar eigen smaak opgezet. Door de plugins [postcss-import](https://github.com/postcss/postcss-import), [postcss-nested](https://github.com/postcss/postcss-nested) en [postcss-preset-env](https://preset-env.cssdb.org/) te installeren kan ik de stylesheets ongeveer zo inrichten als ik ook met Sass deed. Met de [preset-env](https://preset-env.cssdb.org/) plugin heb ik de mogelijkheid om de nieuwste css technieken te gebruiken. Zin in!

```javascript
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
    })
  ]
}
```

Bij het builden van de live omgeving zorgt PurgeCSS ervoor dat je stylesheet wordt opgeschoond en ongebruikte code wordt verwijderd. PurgeCSS zat al in de 'starter', maar ook dit heb ik iets anders ingericht. Ik vond het handiger om dit als plugin bij PostCSS toe te voegen in plaats van in een aparte config en taak. De opgeschoonde css plaats ik in de `_includes` map zodat het inline te gebruiken is.

Ik voer PurgeCSS alleen uit als Eleventy in de `production` modus draait. Hierdoor wordt het ontwikkelen niet vertraagd. In deze modus wordt ook de html (met inline css) geminimaliseerd. Anders kun je bijvoorbeeld gebruik maken van `cssnano`, zoals in het voorbeeld hieronder:

```javascript
const cssnano = require('cssnano');
const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
  plugins: [
    // PLUGINS

    process.env.ELEVENTY_ENV === 'production' ?
      cssnano({ preset: 'default' })
      : null,

    process.env.ELEVENTY_ENV === 'production' ?
        purgecss({
          content: ["_site/**/*.html", "_site/**/*.js"],
          css: ["src/_includes/css/app.compiled.css"],
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
```

Ik ben benieuwd of dit uiteindelijk wel de juiste manier is. De tijd zal het leren. Tips zijn natuurlijk altijd welkom.
