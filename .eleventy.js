const { DateTime } = require("luxon");
const htmlmin = require("html-minifier");
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginNavigation = require("@11ty/eleventy-navigation");

module.exports = function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);

  eleventyConfig.addWatchTarget("./_temp/app.css");

  eleventyConfig.addPassthroughCopy("./src/static");

  eleventyConfig.addPassthroughCopy({
    "./_temp/app.css": "./app.css"
  });

  eleventyConfig.addPassthroughCopy({
    "./node_modules/alpinejs/dist/alpine.js": "./js/alpine.js",
    "./node_modules/lazysizes/lazysizes.min.js": "./js/lazysizes.js"
  });

  eleventyConfig.addShortcode("version", function () {
    return String(Date.now());
  });

  eleventyConfig.addFilter("readableDate", dateObj => {
    var months = ["jan", "feb", "mar", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
    var month = months[
      DateTime.fromJSDate(dateObj, {zone: "UTC"}).toFormat("M") - 1
    ];
    var day = DateTime.fromJSDate(dateObj, {zone: "UTC"}).toFormat("d");
    var year = DateTime.fromJSDate(dateObj, {zone: "UTC"}).toFormat("yyyy");
    return day + " " + month + " " + year;
    // return DateTime.fromJSDate(dateObj, {zone: "UTC"}).toFormat("d LLLL yyyy");
  });

  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-MM-dd');
  });

  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (
      process.env.ELEVENTY_PRODUCTION &&
      outputPath &&
      outputPath.endsWith(".html")
    ) {
      let minified = htmlmin.minify(content, {
        customAttrSurround: [[/@/, new RegExp('')], [/:/, new RegExp('')]],
        useShortDoctype: true,
        minifyJS: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });

  // Collections
  eleventyConfig.addCollection('posts', collection => {
    return collection.getFilteredByTag('posts').reverse()
  });

  // Plugins
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(pluginRss);

  // Markdown
  let markdownIt = require("markdown-it");
  const lazy_loading = require('markdown-it-image-lazysizes');
  let options = {
    html: true
  };
  let markdownLib = markdownIt(options).use(lazy_loading);
  eleventyConfig.setLibrary("md", markdownLib);

  return {
    dir: {
        input: "src/",
        output: "_site",
        includes: "_includes",
        data: `_data`
    },
    templateFormats: ["html", "md", "njk", "yml"],
    htmlTemplateEngine: "njk",

    // 1.1 Enable elventy to pass dirs specified above
    passthroughFileCopy: true
  };
};
