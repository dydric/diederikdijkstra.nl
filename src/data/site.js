module.exports = {

  // GLOBAL
  name: "Diederik",
  description: "Diederik woont in Leeuwarden met Lotte, Elin en Fedde. Werkt als developer bij TRES. Gespecialiseerd in UX/UI en Design Systems.",
  url: "https://diederikdijkstra.nl", // Don't end with a slash /
  authorName: 'Diederik',
  authorEmail: 'diederikdijkstra@icloud.com',
  lang: "nl",
  dateNow: Date.now(),
  env: process.env.ELEVENTY_PRODUCTION,

  // SOCIAL
  themeColor: '#000000',
  twitter: "@dydric",
  socialImage: "/static/images/social.jpg",
  locale: "nl_NL",

  // COLLECTIONS
  rootCollections: 'blog',
  maxPostsInFeed: 20,
  itemsPerPage: 5,

  // copy list below in pages/tags.njk under pagination.filters
  filterTags: ['all', 'nav', 'blog', 'post', 'posts', 'tagList', 'postFeed'],

};
