// Load zone.js for the server.
require('zone.js/dist/zone-node');

var fs = require('fs')

// Import renderModuleFactory from @angular/platform-server.
var renderModuleFactory = require('@angular/platform-server').renderModuleFactory;

// Import the AOT compiled factory for your AppServerModule.
// This import will change with the hash of your built server bundle.
console.log(`${process.cwd()}/dist-server`)

var files = fs.readdirSync(`${process.cwd()}/dist-server`);
var mainFiles = files.filter(file => file.startsWith('main'));
var hash = mainFiles[0].split('.')[1];


var AppServerModuleNgFactory = require(`./dist-server/main.${hash}.bundle`).AppServerModuleNgFactory;

// Load the index.html file.
var index = fs.readFileSync('./dist/index.html', 'utf8');

// Render to HTML and log it to the console.
renderModuleFactory(AppServerModuleNgFactory, {document: index, url: '/'})
  .then(html => fs.writeFileSync('dist/index.html', html));
