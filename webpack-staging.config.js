var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  cache: false,
  devtool: "source-map",
  entry: {
    app: [
      path.join(__dirname, "src/app/App.jsx")
    ],
    vendor: [ "d3", "react", "react-dom", "superagent", "react-tooltip" ]
  },
  resolve: {
    // When requiring, you don't need to add these extensions
    extensions: ["", ".js", ".jsx"],
    alias: {
      "react": path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
      "react-router": path.resolve(__dirname, "node_modules/react-router"),
      "@roam/react-shared": path.resolve(__dirname, "node_modules/@roam/react-shared/src"),
      "assets": path.resolve(__dirname, "src/assets")
    },
    root: path.resolve(__dirname, "src/app"),
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "main.[chunkhash].js",
    publicPath: "/"
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.[chunkhash].js"),
    new HtmlWebpackPlugin({
        inject: true,
        template: path.join(__dirname, "src/public/index.html"),
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          minifyJS: true
        }
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }),
    new webpack.optimize.UglifyJsPlugin({ compress: false })
  ],
  module: {
    loaders: [
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.(js|jsx)$/, loaders: [ "react-hot", "babel-loader" ], include: [ path.join(__dirname, "src"), path.resolve(__dirname, "../react-shared/src") ] },
      { test: /\.less$/, loader: "style!css!less" },
      { test: /\.json$/, loader: "json-loader" },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
      { test: /\.(png|jpg|jpeg|gif)?$/, loader: "file" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" }
    ]
  },
  eslint: {
    configFile: path.resolve(__dirname, "../src/.eslintrc")
  }
};
