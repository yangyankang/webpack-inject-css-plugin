const HtmlWebapckPlugin = require("html-webpack-plugin");
const InjectCssPlugin = require("../../src/index");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
module.exports = {
  mode: 'production',
  entry: ["./index.js"],
  devServer: {
    contentBase: "./dist",
    host: "127.0.0.1",
    hot: false,
    inline: false,
    port: 9000,
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve("dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebapckPlugin({
      filename: "./main.html",
      template: "./index.html",
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "main.css",
    }),
    new InjectCssPlugin({
      cssArr: ['add.css'],
      needContextPath: true
    }),
  ],
};
