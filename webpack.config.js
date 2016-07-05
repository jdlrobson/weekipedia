module.exports = {
    entry: "./libs/client/app.js",
    output: {
      path: __dirname + '/public/dist',
      filename: "bundle.js",
      publicPath: "/dist/"
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel?presets[]=es2015',
          exclude: /node_modules/
        },
      ]
    }
};