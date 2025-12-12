//@ts-check

"use strict";

const path = require("path");
const webpack = require("webpack");

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

/** @type WebpackConfig */
// 扩展程序配置 - 为VS Code扩展构建主程序
const extensionConfig = {
  target: "node", // VS Code扩展在Node.js环境中运行 📖 -> https://webpack.js.org/configuration/node/
  mode: "none", // 保持源代码尽可能接近原始代码（打包时设置为'production'）

  entry: "./src/extension.ts", // 此扩展的入口点 📖 -> https://webpack.js.org/configuration/entry-context/
  output: {
    // 捆绑包存储在'dist'文件夹中（参见package.json） 📖 -> https://webpack.js.org/configuration/output/
    path: path.resolve(__dirname, "dist"),
    filename: "extension.js",
    libraryTarget: "commonjs2",
  },
  externals: {
    vscode: "commonjs vscode", // vscode模块是动态创建的，必须排除。添加其他无法webpack的模块 📖 -> https://webpack.js.org/configuration/externals/
    // 这里添加的模块也需要添加到.vscodeignore文件中
  },
  resolve: {
    // 支持读取TypeScript和JavaScript文件 📖 -> https://github.com/TypeStrong/ts-loader
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
    ],
  },
  devtool: "nosources-source-map",
  infrastructureLogging: {
    level: "log", // 启用问题匹配器所需的日志
  },
};

/** @type WebpackConfig */
// Webview配置 - 为VS Code webview构建React应用
const webviewConfig = {
  target: "web",
  mode: "production",

  entry: "./src/webview/index.tsx", // Webview入口点
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "webview.js",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
    alias: {
      "@": path.resolve(__dirname, "src/webview"),
    },
  },
  module: {
    rules: [
      {
        // 处理React和TypeScript文件
        test: /\.[tj]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    browsers: [
                      "last 1 Chrome version",
                      "last 1 Firefox version",
                    ],
                  },
                },
              ],
              [
                "@babel/preset-react",
                {
                  runtime: "automatic",
                },
              ],
              "@babel/preset-typescript",
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  devtool: false,
  infrastructureLogging: {
    level: "log",
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
  ],
};

module.exports = [extensionConfig, webviewConfig];
