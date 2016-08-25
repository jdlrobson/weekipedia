const version = process.env.OFFLINE_VERSION;

var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    entry: {
      main: "./libs/client/app.js",
      sw: "./libs/workers/service-worker.js",
      push: "./libs/workers/web-push.js"
    },
    output: {
      path: __dirname + '/public/',
      filename: "[name]-bundle.js",
      publicPath: "/"
    },
    plugins: [
      new ExtractTextPlugin('style.css', { allChunks: true }),
      new webpack.DefinePlugin({
        'global.__VERSION__': version
      }),
    ],
    resolve: {
      extensions: ['', 'index.js', '.js', '.jsx' ]
    },
    module: {
      loaders: [
        {
          test: /\.jsx$/,
          loader: 'babel?presets[]=es2015&presets=react',
          exclude: /node_modules/
        },
        {
          test: /\.js$/,
          loader: 'babel?presets[]=es2015',
          exclude: /node_modules/
        },
        { test: /\.(svg)$/, loader: 'svg-url-loader' },
        { test: /\.(gif|png|jpg)$/, loader: 'url?limit=25000' },
        { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css') },
        { test: /\.less$/, loader: ExtractTextPlugin.extract('style', 'css!less') }
      ]
    }
};