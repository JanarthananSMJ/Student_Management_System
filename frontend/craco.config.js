const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

// Find every `postcss-loader` entry inside webpack's (possibly deeply
// nested, via `oneOf`) rule list.
function findPostcssLoaderEntries(rules) {
  const matches = [];
  (rules || []).forEach((rule) => {
    if (Array.isArray(rule.oneOf)) {
      matches.push(...findPostcssLoaderEntries(rule.oneOf));
    }
    if (Array.isArray(rule.use)) {
      rule.use.forEach((entry) => {
        const loaderPath = typeof entry === 'string' ? entry : entry && entry.loader;
        if (loaderPath && loaderPath.includes('postcss-loader')) {
          matches.push(entry);
        }
      });
    }
  });
  return matches;
}

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Force webpack to prefer CJS ("main") builds over ESM ("module") builds
      // for node_modules resolution. Some newer packages (e.g. lucide-react)
      // ship ESM-only bundles that re-export named exports from React's CJS
      // package; webpack 4 (used by react-scripts 4 / CRA4) cannot statically
      // analyze React's conditional `module.exports = ... ? prod : dev` and
      // throws "Can't import the named export ... from non EcmaScript module".
      // Preferring "main" avoids the ESM path entirely and sidesteps this.
      webpackConfig.resolve.mainFields = ['main', 'module', 'browser'];

      // react-scripts' webpack rules only recognize `.js`/`.mjs` for JS
      // loaders; lucide-react's CJS build ships as `.cjs`, which would
      // otherwise fall through to the generic file-loader (treating it as a
      // binary asset instead of a JS module, breaking named imports). Tell
      // webpack to parse `.cjs` files under node_modules as plain JS.
      const oneOfRule = webpackConfig.module.rules.find((rule) => Array.isArray(rule.oneOf));
      if (oneOfRule) {
        oneOfRule.oneOf.unshift({
          test: /\.cjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        });
      }

      // react-scripts 4 (CRA4) ships postcss-loader@3, which is hard-pinned
      // to postcss@7 internally. Tailwind CSS v3 and autoprefixer v10 both
      // require postcss@8, so running them through that old loader fails
      // with "PostCSS plugin tailwindcss requires PostCSS 8" regardless of
      // what postcss version is installed at the project root. We swap in a
      // postcss-loader@4 (installed as a devDependency here) which supports
      // both postcss@7 and postcss@8, and rewrite its options to the newer
      // `postcssOptions` schema that v4 expects.
      const postcssLoaderEntries = findPostcssLoaderEntries(webpackConfig.module.rules);
      postcssLoaderEntries.forEach((entry) => {
        const previousSourceMap = entry.options && entry.options.sourceMap;
        entry.loader = require.resolve('postcss-loader');
        entry.options = {
          postcssOptions: {
            ident: 'postcss',
            plugins: [tailwindcss, autoprefixer],
          },
          sourceMap: previousSourceMap,
        };
      });

      return webpackConfig;
    },
  },
};
