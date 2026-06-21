const fs   = require('fs');
const path = require('path');

module.exports = function (eleventyConfig) {
  // ── Content data ──────────────────────────────────────────────────────────
  // Load every JSON file in content/ as a global data variable named after the file.
  // e.g. content/home.json  →  {{ home.name }} in any template
  const contentDir = path.join(__dirname, 'content');
  fs.readdirSync(contentDir)
    .filter(f => f.endsWith('.json'))
    .forEach(f => {
      const key = path.basename(f, '.json');
      eleventyConfig.addGlobalData(key, () =>
        JSON.parse(fs.readFileSync(path.join(contentDir, f), 'utf8'))
      );
    });

  // ── Static assets ─────────────────────────────────────────────────────────
  eleventyConfig.addPassthroughCopy('assets');
  eleventyConfig.addPassthroughCopy('Maxwell-Fleming-Resume-2026.pdf');
  eleventyConfig.addPassthroughCopy('dashboard');   // kept as plain HTML

  // ── Watch ─────────────────────────────────────────────────────────────────
  eleventyConfig.addWatchTarget('content/');
  eleventyConfig.addWatchTarget('assets/');

  // ── Filters ───────────────────────────────────────────────────────────────
  eleventyConfig.addFilter('dump', val => JSON.stringify(val));

  return {
    dir: {
      input:    'src',
      output:   '_site',
      includes: '_includes',
    },
    templateFormats: ['njk', 'html', 'md'],
  };
};
