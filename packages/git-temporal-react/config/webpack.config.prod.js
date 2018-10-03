/*
  A generic webpack for building React components written in coffeescript and CJSX

*/
const Path = require('path');
const Webpack = require('webpack');
const { StatsWriterPlugin } = require('webpack-stats-plugin');

const outputDir = Path.resolve(__dirname, '../dist/');

module.exports = {
  name: 'git-temporal-react',
  entry: './index.js',
  output: {
    path: outputDir,
    filename: `git-temporal-react.js`,
    libraryTarget: 'umd',
    library: 'GitTemporal',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    // test directory isn't included in bundle but the linter config looks here for module resolution queues
    modules: [Path.resolve(__dirname, '../src'), 'node_modules'],
  },
  resolveLoader: {
    modules: [Path.resolve(__dirname, '../node_modules')],
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
    },
  },
  module: {
    loaders: [
      {
        test: /\.(t|j)sx?$/,
        // loaders: ['cache-loader', 'babel-loader'],
        loaders: ['babel-loader'],
      },
      {
        test: /\.(csv|txt|tpl)$/,
        loader: 'raw-loader',
      },
      {
        //inline base64 encoded images, fonts
        test: /\.(png|jpg|gif|woff|woff2|svg|ttf|eot)$/,
        loader: 'url-loader',
      },
    ],
  },

  plugins: [
    // // This plugin produces app/webroot/v7/webpackStats.json
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
    new Webpack.DefinePlugin({
      // this is what tells React to run in production mode
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new Webpack.optimize.UglifyJsPlugin({
      // makes stack traces on exception unintelligible
      mangle: false,
      mangleProperties: false,
      sourceMap: false,
    }),
  ],
};
