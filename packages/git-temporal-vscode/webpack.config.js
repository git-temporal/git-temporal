/*
  A generic webpack for building React component library

*/
const path = require('path');

const webpack = require('webpack');
const { StatsWriterPlugin } = require('webpack-stats-plugin');

const outputDir = path.resolve(__dirname, './dist/');
const libDir = path.resolve(__dirname, './lib/webviewContents');

module.exports = {
  name: 'git-temporal-vscode-webview',
  entry: require.resolve(libDir, 'webviewContents/index.js'),
  output: {
    path: outputDir,
    filename: `index.js`,
    libraryTarget: 'umd',
    library: 'GitTemporal',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    // test directory isn't included in bundle but the linter config looks here for module resolution queues
    modules: ['node_modules', libDir],
    alias: {
      app: libDir,
    },
  },
  // resolveLoader: {
  //   modules: [path.resolve(__dirname, './node_modules')],
  // },

  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        loader: require.resolve('source-map-loader'),
        enforce: 'pre',
        include: libDir,
      },
      {
        test: /\.(js|jsx|mjs)$/,
        include: libDir,
        loader: require.resolve('babel-loader'),
        options: {
          compact: true,
        },
      },
    ],
  },

  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
    // // This plugin produces dist/webpackStats.json
    // //
    // // You can upload the file here to easily analyze the contents of the bundles:
    // // https://chrisbateman.github.io/webpack-visualizer/
    // //
    // // Upload here: http://webpack.github.io/analyse/ to see the full dependency graph .
    new StatsWriterPlugin({
      filename: 'webpackStats.json',
      fields: null,
      transform(data, opts) {
        const stats = opts.compiler.getStats().toJson({ chunkModules: true });
        return JSON.stringify(stats, null, 2);
      },
    }),
    new webpack.DefinePlugin({
      // this is what tells React to run in production mode
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   // makes stack traces on exception unintelligible
    //   mangle: false,
    //   mangleProperties: false,
    //   sourceMap: false,
    // }),
  ],
};
