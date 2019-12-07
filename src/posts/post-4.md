---
title: Dark-mode 🕯
date: 2019-12-06
featured_image:
image_caption:
excerpt: Ik wil <em>natuurlijk</em> dat mijn site er in <code>dark-mode</code> ook goed uit ziet. Het lijkt me daarom goed om dit eerst in te gaan richten voordat ik begin met het stijlen van de layout.
tags:
  - post
  - redesign
---

Het idee is simpel. Met onderstaande code kun je stijling toevoegen die alleen in dark-mode wordt gebruikt.

```css
@media (prefers-color-scheme: dark) {

}
```

Deze code kun je toevoegen bij elk component dat je wilt aanpassen, maar hierdoor wordt het wel snel onoverzichtelijk. Ik wil een betere oplossing maken en hiervoor globale [`css-variabelen`](https://caniuse.com/#feat=css-variables) gaan gebruiken. Doordat het mogelijk is om kleuren direct uit Tailwind te halen, kan ik deze als variabelen gebruiken en zo twee thema's maken.

```css
:root {
  --color-bg: theme("colors.gray.100");
  --color-text: theme("colors.gray.800");
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: theme("colors.gray.800");
    --color-text: theme("colors.gray.100");
  }
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
}
```

Op deze manier hoef ik de kleuren maar op één plek te configureren. Andersom kan ook. Zo zou ik ook de variabelen als kleur in Tailwind kunnen gebruiken. Door onderstaande snippet toe te voegen bij de `colors` zijn de kleuren ook als `class` te gebruiken.

```js
 theme: {
    'color-1': 'var(--color-bg)',
    'color-2': 'var(--color-text)'
  }
```

Nu kan ik de classes `bg-theme-color-1 text-theme-color-2` aan bijvoorbeeld de body toevoegen in plaats van in de css te stijlen. Ik gebruik dit momenteel (nog) niet. Ook qua naamgeving heb ik nog niet een oplossing bedacht waar ik heel tevreden mee ben.

Wil je alle variabelen uit tailwind beschikbaar maken dan is `tailwind-css-variables` misschien een geschikte, snellere oplossing.