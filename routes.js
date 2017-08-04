require('zone.js/dist/zone-node');
var fs = require('fs')

var { NgModule, ReflectiveInjector, NgZone, NgModuleFactoryLoader } = require('@angular/core');
var { platformServer, ServerModule } = require('@angular/platform-server');
var { provideModuleMap } = require('@nguniversal/module-map-ngfactory-loader');
var { Route, Routes, ROUTES } = require('@angular/router');

var files = fs.readdirSync(`${process.cwd()}/dist-server`);
var mainFiles = files.filter(file => file.startsWith('main'));
var hash = mainFiles[0].split('.')[1];

var { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require(`./dist-server/main.${hash}.bundle`);

const ngZone = new NgZone({ enableLongStackTrace: false });
var rootInjector = ReflectiveInjector.resolveAndCreate(
  [
    { provide: NgZone, useValue: ngZone },
    provideModuleMap(LAZY_MODULE_MAP)
  ],
  platformServer().injector
);

function superFlatten(array) {
  return !Array.isArray(array) ? array : [].concat.apply([], array.map(superFlatten));
}

function flatten(routes) {
  return routes.map(route => {
    if (!route.children) {
      return route.path;
    } else {
      return flatten(route.children).map(childRoute => route.path + childRoute)
    }
  })
}

function createModule(factory, parentInjector) {

  var moduleRef = factory.create(parentInjector ? parentInjector : rootInjector);
  var injector = moduleRef.injector;

  var routes = injector.get(ROUTES);
  var loader = injector.get(NgModuleFactoryLoader);

  return routes.reduce((a, b) => a.concat(b))
    .map(route => {
      delete route.data;
      delete route.canActivate;
      delete route.canDeactivte;
      delete route.component;
      if (route.loadChildren) {
        return loader.load(route.loadChildren)
          .then(factory => Promise.all(createModule(factory, injector))
            .then(childRoutes => {
              delete route.loadChildren;
              route.children = childRoutes;
              route.path = route.path ? '/' + route.path : route.path;
              return route
            }))
      } else {
        route.path = route.path ? '/' + route.path : ''
        return Promise.resolve(route);
      }
    })
}

Promise.all(createModule(AppServerModuleNgFactory))
  .then(routes => {
    var flat = flatten(routes);
    var reallyFlat = superFlatten(flat).map(path => path ? path : '/');
    console.log(JSON.stringify(reallyFlat))
  })
