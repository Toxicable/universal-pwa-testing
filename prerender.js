// Load zone.js for the server.
require('zone.js/dist/zone-node');

var fs = require('fs')

var files = fs.readdirSync(`${process.cwd()}/dist-server`);
var mainFiles = files.filter(file => file.startsWith('main'));
var hash = mainFiles[0].split('.')[1];

const a = require('@nguniversal/module-map-ngfactory-loader');
var { renderModuleFactory } = require('@angular/platform-server');
var { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require(`./dist-server/main.${hash}.bundle`);
//var { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require(`./dist-server/main.bundle`);
var {NgModuleFactoryLoader} = require('@angular/core')
// Load the index.html file.
var index = fs.readFileSync('./dist/index.html', 'utf8');

// Render to HTML and log it to the console.
renderModuleFactory(AppServerModuleNgFactory, {
  document: index,
  url: '/',
  extraProviders: [
    a.provideModuleMap(LAZY_MODULE_MAP)
   ]
})
.then(html => fs.writeFileSync('dist/index.html', html));
