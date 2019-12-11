---
title: "Een blog moet natuurlijk een CMS hebben \U0001F61B"
date: '2019-12-11'
tags:
  - post
  - redesign
excerpt: >-
  Mijn berichten kan ik nu publiceren via <a
  href="https://www.netlifycms.org/">Netlify CMS</a>. Dit is via een
  config-bestand helemaal naar wens en op maat in te richten. Het is zelf zo in
  te stellen dat je een hele Editor workflow hebt (zie screenshot). Ik heb ook
  de menu-structuur, die ik van een <code>.json</code> uitlees, beheerbaar
  gemaakt via de CMS.
featured_image: /static/images/uploads/netlify-cms.png
---
Dit was eerst even puzzelen omdat ik het nog nooit gedaan had, maar door de file-widget te gebruiken is dit op de volgende manier goed in te regelen:

``` yaml
- name: "globals"
    label: "Globals"
    files:
      - label: "Navigation"
        name: "nav"
        delete: false
        file: "src/_data/dev/navigation.json"
        fields:
          - label: "Items"
            name: "items"
            widget: "list"
            fields:
              - label: "Text"
                name: "text"
                widget: "string"
              - label: "Url"
                name: "url"
                widget: "string"
              - label: "Items"
                name: "items"
                widget: "list"
                fields:
                  - label: "Text"
                    name: "text"
                    widget: "string"
                  - label: "Url"
                    name: "url"
                    widget: "string"
```

Geen idee of dit handig is in de praktijk en of ik dit blijf houden, maar het kan en is in principe nu voor alle globale instellingen in te regelen.

Daarnaast ben ik bezig geweest om de data van mijn musiclog playlist's in te laden via de [spotify-api](https://www.npmjs.com/package/spotify-web-api-node) en heb ik wat wijzigingen aangebracht in de css-indeling en de homepage een klein beetje gestyled. Ik ben nog heel erg zoekende welke richting ik op wil qua style, maar vind het voor nu belangrijker om de basis goed klaar te zetten en daar over na te denken. Ik zal in een volgend bericht wat meer vertellen over mijn musiclog dat ik het hele jaar heb bijgehouden.
