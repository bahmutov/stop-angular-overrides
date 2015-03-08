/* global window */
(function stopAngularOverrides(angular) {
  'use strict';

  if (!angular) {
    throw new Error('Missing angular');
  }

  var _module = angular.bind(angular, angular.module);

  var existingModules = Object.create(null);
  var existingFilters = Object.create(null);
  var existingControllers = Object.create(null);
  var existingServices = Object.create(null);

  function createServiceProxyFn(module, moduleServiceFn) {
    return function (name, fn) {
      if (existingServices[name]) {
        throw new Error('Angular service ' + name + ' already exists');
      }
      existingServices[name] = true;
      return moduleServiceFn.call(module, name, fn);
    };
  }

  angular.module = function (name, deps) {
    if (!deps) {
      return _module(name);
    }
    if (existingModules[name]) {
      throw new Error('Angular module ' + name + ' already exists');
    }
    existingModules[name] = true;
    var m = _module(name, deps);

    // proxy .filter calls to the new module
    var _filter = angular.bind(m, m.filter);
    m.filter = function (name, fn) {
      if (existingFilters[name]) {
        throw new Error('Angular filter ' + name + ' already exists');
      }
      existingFilters[name] = true;
      return _filter(name, fn);
    };

    // proxy .controller calls to the new module
    var _controller = angular.bind(m, m.controller);
    m.controller = function (name, fn) {
      if (existingControllers[name]) {
        throw new Error('Angular controller ' + name + ' already exists');
      }
      existingControllers[name] = true;
      return _controller(name, fn);
    };

    // proxy .service calls to the new module
    m.service = createServiceProxyFn(m, m.service);

    // proxy .factory calls to the new module
    m.factory = createServiceProxyFn(m, m.factory);

    // proxy .value calls to the new module
    m.value = createServiceProxyFn(m, m.value);

    // proxy .provider calls to the new module
    m.provider = createServiceProxyFn(m, m.provider);

    return m;
  };

}(window.angular));
