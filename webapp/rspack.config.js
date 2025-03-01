const path = require('path');
const rspack = require('@rspack/core');

/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),  // Add this line
      inject: true
    }),
    new rspack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    }),
  ],
  experiments: {
    css: true,
  },
  entry: {
    main: './src/index.jsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'builtin:swc-loader',
        options: {
          jsc: {
            parser: {
              syntax: 'ecmascript',
              jsx: true,
            },
            transform: {
              react: {
                runtime: 'automatic',
              },
            },
          },
        },
      },
      {
        test: /\.css$/,
        type: 'css',
        use: [
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: {
                  tailwindcss: {},
                  autoprefixer: {},
                },
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        type: 'asset',
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: process.env.NODE_ENV === 'production'
      ? '[name].[contenthash:8].js'
      : '[name].js',
    cssFilename: process.env.NODE_ENV === 'production'
      ? '[name].[contenthash:8].css'
      : '[name].css',
    publicPath: '/',
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    port: 3000,
    host: '0.0.0.0',
    client: {
      webSocketURL: 'auto://0.0.0.0:8000/ws',
    },
    static: {
      directory: path.join(__dirname, 'public'),
    },
    allowedHosts: 'all',
  },
};
