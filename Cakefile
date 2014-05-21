fs = require 'fs'
path = require 'path'

if fs.existsSync(path.resolve(__dirname, './node_modules/frontier-build-tools/node_modules/coffee-script/register.js'))
  require './node_modules/frontier-build-tools/node_modules/coffee-script/register'

utils = require './node_modules/frontier-build-tools/cake/app.coffee'
utils(__dirname)
