const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const rollup = require('rollup');
const uglify = require('uglify-js');

const config = require('./rollup.config');

build();

async function build() {
  const bundle = await rollup.rollup(config);
  const output = config.output;
  const { file, banner } = output;
  const { code, map } = await bundle.generate(output);

  // .js
  await write(file, code, true);

  // .min.js
  let minified = (banner ? banner + '\n' : '') + uglify.minify(code, {
    output: {
      ascii_only: true
    },
    compress: {
      pure_funcs: ['makeMap']
    }
  }).code;
  await write(file.replace('.js', '.min.js'), minified, true);
}

function write(dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report (extra) {
      console.log(blue(path.relative(process.cwd(), dest)) + ' ' + getSize(code) + (extra || ''))
      resolve()
    }

    fs.writeFile(dest, code, err => {
      if (err) return reject(err)
      if (zip) {
        zlib.gzip(code, (err, zipped) => {
          if (err) return reject(err)
          report(' (gzipped: ' + getSize(zipped) + ')')
        })
      } else {
        report()
      }
    })
  })
}

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function blue (str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}
