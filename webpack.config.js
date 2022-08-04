import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

import path from "path";

const devMode = process.env.NODE_ENV !== "production";
const outputDirectory = "dist/public";

export default {
  entry: "./client",
  mode: devMode ? "development" : "production",
  output: {
    path: path.resolve(outputDirectory),
    filename: devMode ? "[name].js" : "[name].[hash].js",
    chunkFilename: devMode ? "[id].js" : "[id].[hash].js",
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".js", ".jsx", ".json", ".css"],
  },

  module: {
    rules: [
      {
        test: /\.m?jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: devMode ? "[name].css" : "[name].[hash].css",
      chunkFilename: devMode ? "[id].css" : "[id].[hash].css",
    }),
    new HtmlWebpackPlugin({
      template: "./client/public/index.html",
    }),
  ],
};
