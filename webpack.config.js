require('dotenv').config()

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const config = () => ({
  name: 'common',
  mode: 'development',
  entry: {
    app: './src/app.module.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'source-map',
  context: __dirname,
  target: 'web',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [
          /node_modules/,
          /\.spec\.js$/
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ]
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new CleanWebpackPlugin(['dist'])
  ],
  resolve: {
    extensions: [
      '.js',
      '.scss',
      '.html',
      '.mjs',
      '.graphql'
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, '/src'),
    filename: 'app.module.js',
    stats: 'minimal',
    open: 'Google Chrome',
    historyApiFallback: true,
    inline: true,
    progress: true,
    host: '127.0.0.1',
    port: '3000',
    proxy: [{
      context: ['/api'],
      target: process.env.BACKEND_SERVER_URI || 'http://localhost:3001',
      pathRewrite: { '^/api': '' }
    }]
  }
})

module.exports = config
