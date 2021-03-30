const htmlmin = require("html-minifier");
const site = require('./src/data/site.js');
const fullDate = require('./src/filters/fullDate.js');
const limit = require('./src/filters/limit.js');
const pluginNavigation = require("@11ty/eleventy-navigation");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);

  eleventyConfig.addWatchTarget("./_temp/style.css");

  eleventyConfig.addPassthroughCopy("./src/static");
  eleventyConfig.addPassthroughCopy({
    "./_temp/style.css": "./style.css",
    "./_redirects": "./_redirects",
    "./node_modules/alpinejs/dist/alpine.js": "./js/alpine.js"
  });

  // Shortcodes
  eleventyConfig.addShortcode("cacheBuster", function () {
    return String(Date.now());
  });

  // Filters
  eleventyConfig.addFilter('fullDate', fullDate);
  eleventyConfig.addFilter('limit', limit);

  // Collections
  const now = new Date();

  const livePosts = post => post.date <= now && !post.data.draft;
  eleventyConfig.addCollection('posts', collection => {
    return [
      ...collection.getFilteredByTag('blog').filter(livePosts)
    ].reverse();
  });

  eleventyConfig.addCollection("tagList", function(collection) {
    let tagSet = new Set();
    collection.getAll().forEach(function(item) {
      if( "tags" in item.data ) {
        let tags = item.data.tags;
        let filterTags = site.filterTags;

        tags = tags.filter(function(item) {
          if (filterTags.indexOf(item) > -1) {
            return false;
          } else {
            return true;
          }
        });

        for (const tag of tags) {
          tagSet.add(tag);
        }
      }
    });

    // returning an array in addCollection works in Eleventy 0.5.3
    return [...tagSet];
  });

  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    // Optional, default is "---"
    // excerpt_separator: "<!-- excerpt -->",
    excerpt_alias: 'excerpt'
  });

  eleventyConfig.addFilter("excerpt", (post) => {
    const content = post.replace(/(<([^>]+)>)/gi, "");
    return content.substr(0, content.lastIndexOf(" ", 200)) + "...";
  });

  // Markdown
  const markdownOptions = {
    html: true,
    breaks: false,
    linkify: true
  };

  eleventyConfig.setLibrary("md", markdownIt(markdownOptions));

  eleventyConfig.addFilter("toHTML", str => {
    return new markdownIt(markdownOptions).renderInline(str);
  });

  // Plugins
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.cloudinaryCloudName = 'diederikdijkstra';

  eleventyConfig.addShortcode('cloudinaryImage', function (path, transforms, alt, classes, width, height) {
    return `<img src="https://res.cloudinary.com/${eleventyConfig.cloudinaryCloudName}/image/fetch/${transforms}/${path}" alt="${alt}" class="${classes}" loading="lazy" width="${width}" height="${height}">`;
  });

  // Transforms
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
        collapseWhitespace: true
      });
      return minified;
    }

    return content;
  });

  // structure
  return {
    dir: {
        input: "src/",
        output: "_site",
        includes: "includes",
        layouts: "layouts",
        data: `data`
    },
    templateFormats: ["html", "md", "njk", "yml"],
    htmlTemplateEngine: "njk",
  };
};
