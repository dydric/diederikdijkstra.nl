const htmlmin = require("html-minifier");
const { DateTime } = require("luxon");

var env = "dev";

module.exports = function (eleventyConfig) {
    // Folders to copy to build dir (See. 1.1)
    eleventyConfig.addPassthroughCopy("src/static");

    if (process.env.ELEVENTY_ENV === 'production' || process.env.ELEVENTY_ENV === 'online' ) {
        // Minify HTML (including inlined CSS and JS)
        eleventyConfig.addTransform("compressHTML", function (content, outputPath) {
            if (outputPath.endsWith(".html")) {
                let minified = htmlmin.minify(content, {
                    useShortDoctype: true,
                    removeComments: true,
                    collapseWhitespace: true,
                    minifyCSS: true,
                    minifyJS: true
                });
                return minified;
            }
            return content;
        });
    }

    // Collections
    eleventyConfig.addCollection('posts', collection => {
        return collection.getFilteredByTag('posts').reverse()
    })

    // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
    eleventyConfig.addFilter('htmlDateString', (dateObj) => {
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
    });

    eleventyConfig.addFilter("readableDate", dateObj => {
        return DateTime.fromJSDate(new Date(dateObj), { zone: 'utc' }).toFormat("dd LLL yyyy");
    });

    eleventyConfig.addFilter("w3cDate", function (date) {
        return date.toISOString();
    });

    if (process.env.ELEVENTY_ENV === 'production') {
        env = "prod"
    }

    if (process.env.ELEVENTY_ENV === 'online') {
        env = "dev"
    }

    console.log(env);

    return {
        dir: {
            input: "src/",
            output: "dist",
            includes: "_includes",
            data: `_data/${env}`
        },
        templateFormats: ["html", "md", "njk", "yml"],
        htmlTemplateEngine: "njk",

        // 1.1 Enable elventy to pass dirs specified above
        passthroughFileCopy: true
    };
};
