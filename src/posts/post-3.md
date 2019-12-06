---
title: Redesign 0.1
date: 2019-11-30
featured_image:
image_caption:
excerpt: Nee, dit is nog niet het nieuwe design. Momenteel heb ik ook nog geen idee welke kant het uiteindelijk op zal gaan. Mijn plan (dit keer) is om het proces stap voor stap bij te houden en alle learnings te documenteren.
tags:
  - post
  - redesign
---

Ik heb wel wat basis-styling doorgevoerd zodat het wel leesbaar is en toch een klein beetje smoelt.

## InterUI

Hiervoor gebruikte ik het font [Inter UI](https://rsms.me/inter/) en dat ga ik nu weer doen. Wel heb ik er voor gekozen om alleen de variabele versie te gebruiken omdat de [meeste browsers](https://caniuse.com/#feat=variable-fonts) dit momenteel wel ondersteunen. De verschillende [`font-feature-settings`](https://caniuse.com/#feat=font-feature) zijn ook gaaf, maar gebruik ik (nog) niet.

```css
@supports (font-variation-settings: normal) {
  body {
    font-family: 'Inter var', sans-serif;
  }
}
```

## Twemoji 🐤

Ook [Twemoji](https://twemoji.twitter.com/) gebruikte ik hiervoor en heb ik nu ook weer toegevoegd. De stijl van de Twemoji's past qua stijl net wat beter. Ook ben je nu altijd zeker dat iemand op een (windows) pc dezelfde emoji's ziet. Wel moet je in PurgeCSS de class `emoji` nog even toevoegen aan de whitelist.

```js
twemoji.parse(document.body);
```

```css
.emoji {
  display: inline-block;
  height: 1em;
  margin: 0 .05em 0 .1em;
  vertical-align: -0.1em;
  width: 1em;
}
```
