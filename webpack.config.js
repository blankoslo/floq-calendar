var webpack = require("webpack");

const port = process.env.PORT || 8080;

module.exports = {
  cache: true,
  entry: [
    `webpack-dev-server/client?http://localhost:${port}`,
    './src/app.jsx'
  ],
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
