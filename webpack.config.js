var ScssParser = require('./webpack/plugin/scssParser/index.js');
var CssMin = require('./webpack/plugin/cssMin/index.js');


module.exports = {
    entry: '/Users/apple/workPlace/nodePluginTest/src/index.js',
    output: '/Users/apple/workPlace/nodePluginTest/dist/index.js',
    plugins: [
        new ScssParser(),
        new CssMin()
    ]
}
