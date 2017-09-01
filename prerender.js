// Load zone.js for the server.
require('zone.js/dist/zone-node');

var fs = require('fs')
var exeSync = require('child_process').execSync


var files = fs.readdirSync(`${process.cwd()}/dist-server`);
var mainFiles = files.filter(file => file.startsWith('main'));
var hash = mainFiles[0].split('.')[1];

var { provideModuleMap } = require('@nguniversal/module-map-ngfactory-loader');
var { renderModuleFactory } = require('@angular/platform-server');
var { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require(`./dist-server/main.${hash}.bundle`);
// Load the index.html file.
var index = fs.readFileSync('./dist/index.html', 'utf8');

var pathsString = exeSync('node routes').toString();
var paths = JSON.parse(pathsString);

paths.forEach(path => {
  console.log('rendering path: ' + path)
  renderModuleFactory(AppServerModuleNgFactory, {
    document: index,
    url: path,
    extraProviders: [
      provideModuleMap(LAZY_MODULE_MAP)
    ]
  })
  .then(html => {
    fs.writeFileSync(`dist/${path.replace(/\//g, '-')}.index.html`, html)
  });
})

// Render to HTML and log it to the console.

