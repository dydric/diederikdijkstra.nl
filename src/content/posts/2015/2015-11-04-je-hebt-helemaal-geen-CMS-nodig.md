---
title: Je hebt helemaal geen $#@%*!^ CMS nodig
date: 2015-11-04
tags:
  - post
  - dev
---

Wilde je vroeger een site online zetten die alleen uit HTML en CSS bestond, dan was je erg beperkt. Tegenwoordig is dit veel makkelijker door de komst van Static Site Generators. Veruit de meest gebruikte is [Jekyll](http://jekyllrb.com/) en de populariteit neemt alleen maar toe. Dat is ook niet zo gek, aangezien er veel voordelen zijn ten opzichte van een dynamische site met CMS.

<!-- excerpt -->

​Static site's zijn **snel te ontwikkelen** en **precies naar wens te bouwen** en in te richten. Ze zijn **niet aan een database gekoppeld** en er zijn **geen beperkingen van een CMS** waar je rekening mee moet houden. In plaats van de site zo (om) te bouwen dat het door de CMS beheerd kan worden, kies je nu voor een oplossing op maat waardoor **beheer veel simpeler** is en de **focus ligt op elementen die echt belangrijk zijn**. Je hebt geen last van een onduidelijke CMS structuur met allerlei workarounds of functies die je nooit gebruikt. En omdat er puur HTML, CSS en JS wordt gegenereerd, zijn static sites **makkelijk te optimaliseren** en **laden ze snel** doordat er (onder andere) geen database koppelingen nodig zijn. **Hosting van static sites is ook veel goedkoper**. Jekyll sites kunnen gemakkelijk via Github Pages (gratis) of Amazon S3 gehost worden. Maar check ook zeker [Netlify.com](http://netlify.com), een hosting service voor static websites. En als de static site eenmaal online staat, heb je veel minder kans dat deze offline raakt. **Een static site is veel stabieler**. Bijvoorbeeld op piekmomenten met enorme aantallen bezoekers, maar ook tegen bugs/errors en hacks.

  [![Google Trends 2014](/static/images/uploads/google-trends-2014.jpg) Google Trends 2014](https://www.google.nl/trends/2014/)

  [![Obama Campagne](/static/images/uploads/obama-campagne.jpg) Obama Campagne](http://contribute.barackobama.com)

Hierboven staan twee voorbeelden van gigantische "static-site" projecten die al weer even geleden zijn ontwikkeld. Google heeft voor het jaaroverzicht gebruik gemaakt van een eigen generator (Goro), maar [Web Fundamentals](https://developers.google.com/web/fundamentals/) bijvoorbeeld (ook van Google) is gebouwd met behulp van Jekyll. Net zoals de Obama Campagne. Meer info over dit project is te vinden in dit ["$250 million fundraising platform"](http://kylerush.net/blog/meet-the-obama-campaigns-250-million-fundraising-platform/) artikel.

Static sites worden dus al enige tijd voor 'serieuze' projecten ingezet. Ze zitten nu echter in een stroomversnelling. Ze worden **in rap tempo steeds meer mainstream**. Website's van (grote) bedrijven zoals [Nest](https://nest.com/) en [Mailchimp](http://mailchimp.com/) zijn gemaakt met behulp van static site generators. Maar ook bedrijven als Nike en Netflix maken er al veelvuldig gebruik van. **De snelle groei van Static Site's is vooral te danken aan de komst van de build-tools Gulp en Grunt**. Hierdoor kunnen developers snel en gemakkelijk ontwikkelen. Hier zal ik later in een ander artikel verder op in gaan.

Om contentbeheer toegankelijk te maken voor klanten (of teams) zijn er platformen ontwikkeld waarmee (de content van) static-site's beheerd kunnen worden. De populairste zijn op dit moment [Cloudcannon](http://cloudcannon.com/) en [Contentful](https://www.contentful.com/). ~~Maar ook PooleApp, waarmee je dynamische content kunt plaatsen en ophalen, kan interessant zijn om in te zetten.~~

 > That being said, static website generators will continue to grow in capability and popularity. The infrastructure and ecosystem will keep maturing. And as the tools improve, we’ll see developers push the limit of what can be done with static websites.
 > &mdash; via [Smashing Magazine.com](http://www.smashingmagazine.com/2015/11/modern-static-website-generators-next-big-thing/)

Natuurlijk is het (nog) niet voor elk project geschikt, maar je kunt er eigenlijk niet meer om heen. Static sites hebben zich al enige jaren bewezen. Ze worden zo snel doorontwikkeld dat ze een vaste waarde zijn en nóg meer gaan worden.
