const eleventyNavigation = require("@11ty/eleventy-navigation");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigation);
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/assets");

  eleventyConfig.addFilter("startsWith", (str, prefix) =>
    str && prefix && str.startsWith(prefix)
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    },
    markdownTemplateEngine: "njk"
  };
};
