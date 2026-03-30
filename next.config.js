const webpack = require('webpack');
const path = require('path');

/**
 * Replace yahoo-finance2 test imports (Deno/testing) with a small stub
 * so Next.js webpack build doesn't try to resolve Deno-only test deps.
 */
module.exports = {
  webpack: (config) => {
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/fetchCache\.js$/, path.resolve(__dirname, 'lib', 'yf_fetchCache_stub.js'))
    );
    return config;
  },
};
