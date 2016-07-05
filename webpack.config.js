var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    entry: "./libs/client/app.js",
    output: {
      path: __dirname + '/public/dist',
      filename: "bundle.js",
      publicPath: "/dist/"
    },
    plugins: [
      new ExtractTextPlugin('style.css', { allChunks: true })
    ],
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel?presets[]=es2015',
          exclude: /node_modules/
        },
        { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css') }
      ]
    }
};