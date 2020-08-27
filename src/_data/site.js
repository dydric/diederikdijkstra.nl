/**
  Your global data folder is controlled by the dir.data configuration option.
  All *.json and module.exports values from *.js files in this directory will
  be added into a global data object available to all templates.

  This file can be accessed using: {{ site.title }}
*/

module.exports = {

  title: "Diederik Dijkstra",
  author: {
    name: "Diederik",
    email: "diederikdijkstra@icloud.com"
  },
  url: "https://diederikdijkstra.nl", // Don't end with a slash /
  archive_url: "/blog/",
  enforce_ssl: "diederikdijkstra.nl",
  description: "Diederik woont in Leeuwarden met Lotte, Elin en Fedde. Werkt als developer bij TRES. Gespecialiseerd in UX/UI en Design Systems.",
  lang: "nl",
  meta_data: {
    theme_color: '#000', // used in Chrome, Firefox OS and Opera
    twitter: "@dydric",
    default_social_image: "/static/images/meta/featured_image.jpg"
  }
};
