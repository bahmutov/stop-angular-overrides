/* global window */
(function stopAngularOverrides(angular) {
  'use strict';

  if (!angular) {
    throw new Error('Missing angular');
  }

  var _module = angular.bind(angular, angular.module);

  function createUniqueNamingCheckFn(type) {
    var existingNames = Object.create(null);
    return function (name) {
      if (existingNames[name]) {
        throw new Error('Angular ' + type + ' ' + name + ' already exists');
      }
      existingNames[name] = true;
    };
  }

  var existingModulesCheck = createUniqueNamingCheckFn('module');
  var existingFiltersCheck = createUniqueNamingCheckFn('filter');
  var existingControllersCheck = createUniqueNamingCheckFn('controller');
  var existingServicesCheck = createUniqueNamingCheckFn('service');
  var existingDirectivesCheck = createUniqueNamingCheckFn('directive');

  function createServiceProxyFn(module, moduleServiceFn) {
    return function (name, fn) {
      existingServicesCheck(name);
      return moduleServiceFn.call(module, name, fn);
    };
  }

  angular.module = function (name, deps) {
    if (!deps) {
      return _module(name);
    }
    existingModulesCheck(name);

    var m = _module(name, deps);

    // proxy .filter calls to the new module
    var _filter = angular.bind(m, m.filter);
    m.filter = function (name, fn) {
      existingFiltersCheck(name);
      return _filter(name, fn);
    };

    // proxy .controller calls to the new module
    var _controller = angular.bind(m, m.controller);
    m.controller = function (name, fn) {
      existingControllersCheck(name);
      return _controller(name, fn);
    };

    // proxy .directive calls to the new module
    var _directive = angular.bind(m, m.directive);
    m.directive = function (name, fn) {
      existingDirectivesCheck(name);
      return _directive(name, fn);
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
