const { DateTime } = require("luxon");
const htmlmin = require("html-minifier");
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginNavigation = require("@11ty/eleventy-navigation");
const embeds = require("eleventy-plugin-embed-everything");

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

  // EXCERPT
  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    // Optional, default is "---"
    excerpt_separator: "<!-- excerpt -->",
    excerpt_alias: 'excerpt'
  });

  eleventyConfig.addShortcode("version", function () {
    return String(Date.now());
  });

  eleventyConfig.addFilter("readableDate", dateObj => {
    var months = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
    var month = months[
      DateTime.fromJSDate(dateObj, {zone: "UTC"}).toFormat("M") - 1
    ];
    var day = DateTime.fromJSDate(dateObj, {zone: "UTC"}).toFormat("d");
    var year = DateTime.fromJSDate(dateObj, {zone: "UTC"}).toFormat("yyyy");
    return day + " " + month + " " + year;
    // return DateTime.fromJSDate(dateObj, {zone: "UTC"}).toFormat("d LLLL yyyy");
  });

  eleventyConfig.addFilter("readableDate2", dateObj => {
    var day = DateTime.fromJSDate(dateObj, {zone: "UTC"}).toFormat("d");
    var month = DateTime.fromJSDate(dateObj, {zone: "UTC"}).toFormat("MM");
    var year = DateTime.fromJSDate(dateObj, {zone: "UTC"}).toFormat("yyyy");
    return ("0" + day).slice(-2) + "-" + month + "-" + year;
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
    return collection.getFilteredByTag('posts').reverse();
  });

  // Plugins
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(embeds);

  // Markdown

  const md = require('markdown-it')({
    html: true
  });

  eleventyConfig.addNunjucksFilter(
    "markdownify", markdownString => md.render(markdownString)
  );

  let markdownIt = require("markdown-it");
  let lazy_loading = require('markdown-it-image-lazysizes');
  let markdownLib = markdownIt({html: true}).use(lazy_loading);
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
