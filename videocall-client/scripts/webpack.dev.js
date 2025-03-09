import path, { dirname } from 'path'
import { fileURLToPath } from "url"
import { merge } from 'webpack-merge'
import config from './webpack.config.js'
import Dotenv from 'dotenv-webpack'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const devConfig = merge(config, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
	  open: true, // 编译完自动打开浏览器
    host: '192.168.3.5',
    port: 8080,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, '../ssl/key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, '../ssl/cert.pem'))
    },
    compress: true,
    hot: true,
    proxy: {
      '/api': {
        target: 'https://192.168.3.5:3000',
        pathRewrite: { '^/api': '' },
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'https://192.168.3.5:3000',
        ws: true,
        secure: false,
      },
    },
  },
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, '../.env.development'), // 指定环境变量文件路径
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              importLoaders: 0,
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          {
            loader: "css-loader",
            options: {
              modules: true,
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {		
              postcssOptions: {
                plugins: [['postcss-preset-env', {}]]
              },
            },
          },
          'less-loader',
        ],
        exclude: /node_modules/,
      },
    ],
  },
})

export default devConfig