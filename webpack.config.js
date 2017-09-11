const path = require('path');
const webpack = require('webpack');
const packageJson = require('./package.json');

const environment = process.env.NODE_ENV;
const PRODUCTION = (environment === 'production');

module.exports = {
  entry: path.resolve(__dirname, packageJson.source),
  output: {
    path: __dirname,
    filename: packageJson.main,
    library: packageJson.libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  plugins: [
    new webpack.ProvidePlugin({
      'process.env.NODE_ENV': JSON.stringify(environment)
    }),
    PRODUCTION && new webpack.optimize.UglifyJsPlugin()
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          },
          {
            loader: 'eslint-loader',
            options: {
              failOnError: PRODUCTION
            }
          }
        ]
      }
    ]
  }
};
