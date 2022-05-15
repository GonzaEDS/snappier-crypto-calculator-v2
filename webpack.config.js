// const path = require('path')
// module.exports = {
//   entry: './src/main.js',
//   mode: 'development',
//   output: {
//     path: __dirname + '/dist',
//     filename: 'bundle.js'
//   }
// }

const path = require('path')

module.exports = {
  entry: {
    app: './src/main.js'
  },
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader']
      }
    ]
  }
}
