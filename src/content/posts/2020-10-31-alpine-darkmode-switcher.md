---
title: Alpine Darkmode Switcher
date: 2020-10-31
tags:
  - post
  - dev
---

Ik heb al met diverse darkmode varianten op deze website geëxperimenteerd, maar voor deze recente versie had ik dit nog niet toegevoegd. Ik wilde graag een switch maken waar je als gebruiker ook zelf kunt kiezen welk thema je wilt tonen. Natuurlijk wilde ik dit doen in Alpine.js, maar het was er nog niet van gekomen. Tot dit weekend. Er staat nu een schattig lampje rechtsboven in de headerbalk.

<!-- excerpt -->

Dit is de basis waarmee ik de waarde van de selectbox `preference` kan toevoegen aan de localstorage.

```html
<div x-data="{ preference: localStorage.getItem('theme') }"
    x-init="$watch('preference', (val) => localStorage.setItem('theme', val))">

  <select x-model="preference">
    <option selected value="system">System Preference</option>
    <option value="light">Light Theme</option>
    <option value="dark">Dark Theme</option>
  </select>
</div>
```

Deze waarde wilde ik gebruiken als `data-theme` voor de html. In bovenstaand voorbeeld plaatste ik een `div` voor de `select` met onderstaande code:

```html
<div data-theme="system" x-bind:data-theme="preference"></div>
```

Dit werkte perfect, maar ik liep al direct tegen een kleine uitdaging aan. Ik wilde bovenstaande oplossing niet toepassen op een `div`, maar op de `html` zelf. Hiervoor heb ik één regel aan `$watch` functie toegevoegd.

```html
<html data-theme="system">
  <div
    x-data="{ preference: localStorage.getItem('theme')}"
    x-init="
      $watch('preference', (val) => {
        localStorage.setItem('theme', val);
        document.documentElement.setAttribute('data-theme', preference);
      });
    "
  >
  ....
  </div>
</html>
```

Nu was ik er bijna. Ik zag alleen in sommige situaties een kleine flash verschijnen. Na wat blogs te hebben gelezen, kwam ik uiteindelijk via [Max Bock](https://mxb.dev/blog/color-theme-switcher/) bij de oplossing. Hij had hetzelfde probleem (FODT) en plaatste hiervoor onderstaande regel net voor het sluiten van de `</head>`:

```html
<script>
  localStorage.getItem('theme') &&
  document.documentElement.setAttribute('data-theme', localStorage.getItem('theme'))
</script>
```

Nu was het technisch helemaal naar wens en ben ik begonnen met stylen. Dit is met tailwind ook prima te doen. Zodra ik de opbouw hiervan wat netter heb uitgewerkt zal ik dit ook delen.
