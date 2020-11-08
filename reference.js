const Browserify = require('browserify');
const {default: broaderify} = require('broaderify');
const {writeFileSync} = require('fs');

Browserify()
    .transform(broaderify, {
        global: true,
        loaders: [{
            filter: /node_modules\/react\/index.js/,
            worker: (module, content, done) => {
                done(Buffer.from('module.exports = require(\'./cjs/react.production.min.js\');'));
            }
        }, {
            filter: /node_modules\/react-dom\/index.js/,
            worker: (module, content, done) => {
                done(Buffer.from('module.exports = require(\'./cjs/react-dom.production.min.js\');'));
            }
        }]
    })
    .add('src/index.js')
    .bundle((error, data) => {
        writeFileSync('bundle.js', data);
    });