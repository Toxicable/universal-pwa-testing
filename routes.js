"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('zone.js/dist/zone-node');
var core_1 = require("@angular/core");
var platform_server_1 = require("@angular/platform-server");
var module_map_ngfactory_loader_1 = require("@nguniversal/module-map-ngfactory-loader");
var router_1 = require("@angular/router");
var loader;
function lsRoutes(factoryPath) {
    var _a = require(factoryPath), AppServerModuleNgFactory = _a.AppServerModuleNgFactory, LAZY_MODULE_MAP = _a.LAZY_MODULE_MAP;
    var ngZone = new core_1.NgZone({ enableLongStackTrace: false });
    var rootInjector = core_1.ReflectiveInjector.resolveAndCreate([
        { provide: core_1.NgZone, useValue: ngZone },
        module_map_ngfactory_loader_1.provideModuleMap(LAZY_MODULE_MAP)
    ], platform_server_1.platformServer().injector);
    var moduleRef = AppServerModuleNgFactory.create(rootInjector);
    loader = moduleRef.injector.get(core_1.NgModuleFactoryLoader);
    return Promise.all(createModule(AppServerModuleNgFactory, rootInjector))
        .then(function (routes) {
        var flat = flatten(routes);
        var reallyFlat = superFlatten(flat).map(function (path) { return path ? path : '/'; });
        return reallyFlat;
    });
}
exports.lsRoutes = lsRoutes;
function superFlatten(array) {
    return !Array.isArray(array) ? array : [].concat.apply([], array.map(function (r) { return superFlatten(r); }));
}
function flatten(routes) {
    return routes.map(function (route) {
        if (!route.children) {
            return route.path ? '/' + route.path : '/';
        }
        else {
            return flatten(route.children)
                .map(function (childRoute) { return (!route.path ? '' : '/' + route.path) + (childRoute === '/' ? '' : childRoute); });
        }
    });
}
function extractRoute(route, injector) {
    var newRoute = {
        path: route.path
    };
    if (route.loadChildren) {
        return resolveLazyChildren(route, injector)
            .then(function (childrenRoute) {
            newRoute.children = childrenRoute;
            return newRoute;
        });
    }
    if (route.children) {
        return Promise.all(route.children.map(function (r) { return extractRoute(r, injector); }))
            .then(function (routes) {
            newRoute.children = routes;
            return newRoute;
        });
    }
    return Promise.resolve(newRoute);
}
function resolveLazyChildren(route, injector) {
    if (typeof route.loadChildren === 'function') {
        //not supported
        //return route.loadChildren().;
    }
    return loader.load(route.loadChildren)
        .then(function (factory) { return Promise.all(createModule(factory, injector)); });
}
function createModule(factory, parentInjector) {
    var moduleRef = factory.create(parentInjector);
    var routes = moduleRef.injector.get(router_1.ROUTES);
    var flatterRoutes = routes.reduce(function (a, b) { return a.concat(b); });
    var finalRoutes = [];
    var _loop_1 = function (route) {
        if (route.path && route.path.includes(':')) {
            return "continue";
        }
        if (!route.loadChildren) {
            //no lazy loaded paths so we can return the routes directly
            finalRoutes.push(extractRoute(route, parentInjector));
        }
        else {
            if (typeof route.loadChildren !== 'string') {
                return "continue";
            }
            finalRoutes.push(resolveLazyChildren(route, moduleRef.injector)
                .then(function (childRoutes) { return Promise.all(childRoutes.map(function (r) { return extractRoute(r, parentInjector); })); })
                .then(function (childRoutes) {
                return {
                    path: route.path,
                    children: childRoutes,
                };
            }));
        }
    };
    for (var _i = 0, flatterRoutes_1 = flatterRoutes; _i < flatterRoutes_1.length; _i++) {
        var route = flatterRoutes_1[_i];
        _loop_1(route);
    }
    return finalRoutes;
}
//# sourceMappingURL=routes-ls.js.map
lsRoutes('./dist-server/main.cd6d573dc4653b7d2ed3.bundle.js')
  .then(routes => {
    console.log(JSON.stringify(routes, null, 2))
  })
