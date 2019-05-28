/*global require, module */

const htmlmin = require('html-minifier');

module.exports = eleventyConfig => {

  // Add a readable date formatter filter to Nunjucks
  eleventyConfig.addFilter('dateDisplay', require('./resources/filters/dates.js'));
  eleventyConfig.addFilter('yearDisplay', require('./resources/filters/year.js'));
  eleventyConfig.addFilter('timeDisplay', require('./resources/filters/time.js'));
  eleventyConfig.addFilter('htmlDateDisplay', require('./resources/filters/timestamp.js'));

  // Minify our HTML
  eleventyConfig.addTransform('htmlmin', (content, outputPath) => {
    if( outputPath.endsWith('.html') ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });

  const md = require('markdown-it')({
    html: false,
    breaks: true,
    linkify: true
  });
  eleventyConfig.addNunjucksFilter('markdownify', markdownString => md.render(markdownString));



  // Collections
  eleventyConfig.addCollection('blog', collection => {
    return collection.getFilteredByTag('blog').reverse();
  });

  eleventyConfig.addCollection('recipes', (collection) => {
    return collection.getFilteredByTag('recipes').reverse();
  });

  // eleventyConfig.addCollection('recipes', (collection) => {
  //   return collection.getFilteredByTag('recipes').sort((a, b) => {
  //     if (b.data.title > a.data.title) return -1;
  //     else if (b.data.title < a.data.title) return 1;
  //     else return 0;
  //   });
  // });

  // Layout aliases
  eleventyConfig.addLayoutAlias('default', 'layouts/default.njk');
  eleventyConfig.addLayoutAlias('post', 'layouts/post.njk');
  eleventyConfig.addLayoutAlias('recipe', 'layouts/recipe.njk');

  // Include our static assets
  eleventyConfig.addPassthroughCopy('assets');
  eleventyConfig.addPassthroughCopy('admin');
  eleventyConfig.addPassthroughCopy('images');

  return {
    templateFormats: ['md', 'njk'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    passthroughFileCopy: true,

    dir: {
      input: 'site',
      output: 'dist',
      includes: 'includes',
      data: 'data'
    }
  };
};
