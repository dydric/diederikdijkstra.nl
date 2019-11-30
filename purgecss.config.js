module.exports = {
  content: ["dist/**/*.html", "dist/**/*.js"],
  css: ["src/static/app.compiled.css"],
  whitelist: ['body', 'random', 'yep', 'button'],
  extractors: [{
    extractor: class TailwindCSS {
      static extract(content) {
        return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
      }
    },
    extensions: ["html", "js"]
  }],
  whitelist: ['emoji']
};
