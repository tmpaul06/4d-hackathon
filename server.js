var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var config = require("./webpack-dev.config");
var ipAddress = require("./util/ip").getIp();

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  proxy: {
    "/api/*": "http://" + "localhost" + ":9003"
  }
}).listen(3000, "0.0.0.0", function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log("Listening at localhost:3000");
});
