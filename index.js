var Webpack = require('./webpack/index.js');
var config = require('./webpack.config.js');

require('./otherNodeJS/index.js')
new Webpack(config).start()
