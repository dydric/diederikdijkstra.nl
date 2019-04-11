---
layout: post
title: "\U0001F389 Hallo, daar ben ik weer"
intro: Ik heb mijn website een ‘kleine’ update gegeven en verhuisd naar Netlify.
categories: Blog
---
In mijn vorige setup plaatste ik de code van mijn website op Github. Github (dat Jekyll ondersteund) genereerde hiervan een site. Ik gebruikte Cloudflare als CDN en voor mijn SSL certificaat. Dit is op zich (nog) prima, maar de ontwikkelingen van Static Site’s in combinatie met Netlify hebben me heel enthousiast gemaakt. 

![](/uploads/images/applewatch.jpg "Diederikdijkstra.nl Build 🎉")

Het overstappen naar Netlify ging heel makkelijk. Binnen een paar uurtjes was ik over. Echt bizar hoe goed Netlify in elkaar steekt eigenlijk. In mijn huidige setup host ik nog steeds mijn bestanden op Github, maar gebruik ik Netlify voor het builden, hosten, CDN en SSL. Daarnaast biedt Netlify nog heel veel (gratis) features. Zo kun je formulieren inzetten. Kun je Netlify-CMS helemaal naar wens inrichten om berichten en pagina’s te plaatsen en te beheren. Maar het allermooiste zijn de geautomatiseerde builds die mogelijk zijn. Ik gebruik dit bijvoorbeeld voor mijn tweets. Ik heb een gulp-task gemaakt die mijn laatste tweets ophaalt. Deze taak wordt met behulp van IFTTT en een webhook uitgevoerd wanneer ik een tweet plaats. Op mijn website kan ik nu mijn laatste tweets weergeven zonder gebruik van javascript te maken. Magic! ✨ Dit is een simpele toepassing, maar geeft een goed voorbeeld van de mogelijkheden die tegenwoordig mogelijk zijn met Static Site's. De term van ontwikkelen op deze manier kom je tegenwoordig tegen als [JAMstack](https://jamstack.org/). En of het nu om een simpele (corporate) site, blog/nieuwssite, of een e-commerce webshop gaat. Alles is tegenwoordig mogelijk. En in mijn optiek de toekomst!

> JAMstack: Modern web development architecture based on client-side JavaScript, reusable APIs, and prebuilt Markup.
