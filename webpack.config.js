const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/js/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.handlebars$/,
        loader: 'handlebars-loader',
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ template: 'src/index.html' })],
  devServer: {
    hot: true,
    open: true,
    liveReload: true,
    historyApiFallback: true,
    watchFiles: ['src/**/*'],
  },
};
