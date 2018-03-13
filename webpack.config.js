const offlineVersion = process.env.OFFLINE_VERSION;
const WORDMARK = process.env.SITE_WORDMARK_PATH;
const NODE_ENV = process.env.NODE_ENV
const USE_POLYFILLS = Boolean( process.env.USE_POLYFILLS );
const OFFLINE_STRATEGY = process.env.OFFLINE_STRATEGY || 'none';
const API_PATH = process.env.API_PATH || '/api/';

var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

// There are two possibly entry points. One with polyfills and one without.
var mainEntryPoint = USE_POLYFILLS ? "./libs/client/app-shimmed.js" : "./libs/client/app.js";

module.exports = {
    entry: {
      main: mainEntryPoint,
      sw: "./libs/workers/service-worker.js",
      push: "./libs/workers/web-push.js"
    },
    output: {
      path: __dirname + '/public/',
      filename: "[name]-bundle.js",
      publicPath: "/"
    },
    plugins: [
      new ExtractTextPlugin( { filename: 'style.css', allChunks: true } ),
      new webpack.DefinePlugin({
        'process.env': {
          OFFLINE_STRATEGY: `"${OFFLINE_STRATEGY}"`,
          API_PATH: `"${API_PATH}"`,
          NODE_ENV: `"${process.env.NODE_ENV}"`
        },
        'global.__VERSION__': JSON.stringify( {
          number: offlineVersion,
          wordmark: WORDMARK
        } )
      }),
    ],
    resolve: {
      extensions: ['index.js', '.js', '.jsx' ]
    },
    module: {
      loaders: [
        {
          test: /\.jsx$/,
          loader: 'babel-loader',
          query: {
            presets: [ 'es2015', 'react' ]
          },
          exclude: /node_modules/
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          query: {
            presets: [ 'es2015' ]
          },
          exclude: /node_modules/
        },
        {
          test: /\.(svg)$/,
          loader: 'svg-url-loader'
        },
        {
          test: /\.(gif|png|jpg)$/,
          loader: 'url-loader',
          query: {
            limit: '25000'
          }
        },
        { test: /\.css$/, loader: ExtractTextPlugin.extract( { fallback: 'style-loader', use: [ 'css-loader' ] } ) },
        { test: /\.less$/, loader: ExtractTextPlugin.extract( { fallback: 'style-loader',
          use: [ 'css-loader', 'less-loader' ] } ) }
      ]
    }
};