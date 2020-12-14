module.exports = {

  // GLOBAL
  name: "Diederik",
  description: "Diederik woont in Leeuwarden met Lotte, Elin en Fedde. Werkt als developer bij TRES. Gespecialiseerd in UX/UI en Design Systems.",
  url: "https://diederikdijkstra.nl", // Don't end with a slash /
  authorName: 'Diederik Dijkstra',
  authorEmail: 'diederikdijkstra@icloud.com',
  lang: "nl",
  dateNow: Date.now(),

  // SOCIAL
  themeColor: '#000000',
  twitter: "@dydric",
  socialImage: "/static/images/social.jpg",

  // COLLECTIONS
  rootCollections: 'blog',
  maxPostsInFeed: 20,

  // copy list below in pages/tags.njk under pagination.filters
  filterTags: ['all', 'nav', 'blog', 'post', 'posts', 'tagList', 'postFeed'],

};
