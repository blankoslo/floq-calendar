var webpack = require("webpack");


module.exports = {
  cache: true,
  entry: ['./src/app.jsx'],
  output: {
    path: __dirname + "/dist/js",
    filename: "app.bundle.js"
  },
  module: {
    loaders: [
      { test: /\.less$/, loader: "style!css!less" },
      { test: /\.jsx$/, exclude: /(node_modules)/, loader: "babel" },
      { test: /\.json$/, loader: "json" }
    ]
  }
};
