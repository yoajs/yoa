const path = require('path');
const version = process.env.VERSION || require('../package.json').version;
const buble = require('rollup-plugin-buble');
const replace = require('rollup-plugin-replace');

const banner =
  '/*!\n' +
  ' * Yoa.js v' + version + '\n' +
  ' * (c) 2018-' + new Date().getFullYear() + ' by moonrailgun\n' +
  ' * Released under the MIT License.\n' +
  ' */'

module.exports = {
  input: path.resolve(__dirname, '../src/index.js'),
  plugins: [
    buble(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  output: {
    file: path.resolve(__dirname, '../dist/yoa.js'),
    format: 'cjs',
    banner,
    name: 'yoa'
  }
}
