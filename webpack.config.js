var webpack = require("webpack");

module.exports = {
  cache: true,
  entry: ".src/frontend/app.jsx",
  output: {
    path: __dirname + "/dist/js",
    filename: "app.bundle.js"
  },
  //devtool: "source-map",
  module: {
    loaders: [
      { test: /\.less$/, loader: "style!css!less" },
      { test: /\.jsx$/, exclude: /(node_modules)/, loader: "babel" },
      { test: /\.json$/, loader: "json" }
    ]
  }
};
