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
    var _service = angular.bind(m, m.service);
    m.service = function (name, fn) {
      if (existingServices[name]) {
        throw new Error('Angular service ' + name + ' already exists');
      }
      existingServices[name] = true;
      return _service(name, fn);
    };

    // proxy .factory calls to the new module
    var _factory = angular.bind(m, m.factory);
    m.factory = function (name, fn) {
      if (existingServices[name]) {
        throw new Error('Angular service ' + name + ' already exists');
      }
      existingServices[name] = true;
      return _factory(name, fn);
    };

    // proxy .value calls to the new module
    var _value = angular.bind(m, m.value);
    m.value = function (name, o) {
      if (existingServices[name]) {
        throw new Error('Angular service ' + name + ' already exists');
      }
      existingServices[name] = true;
      return _value(name, o);
    };

    // proxy .provider calls to the new module
    var _provider = angular.bind(m, m.provider);
    m.provider = function (name, fn) {
      if (existingServices[name]) {
        throw new Error('Angular service ' + name + ' already exists');
      }
      existingServices[name] = true;
      return _provider(name, fn);
    };
    return m;
  };

}(window.angular));
