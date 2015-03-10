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

  function createProxyFn(module, moduleFn, existingNameCheck) {
    return function (name, fn) {
      existingNameCheck(name);
      return moduleFn.call(module, name, fn);
    };
  }

  angular.module = function (name, deps) {
    if (!deps) {
      return _module(name);
    }
    existingModulesCheck(name);

    var m = _module(name, deps);

    // proxy .filter calls to the new module
    m.filter = createProxyFn(m, m.filter, existingFiltersCheck);

    // proxy .controller calls to the new module
    m.controller = createProxyFn(m, m.controller, existingControllersCheck);

    // proxy .directive calls to the new module
    m.directive = createProxyFn(m, m.directive, existingDirectivesCheck);

    // proxy .service calls to the new module
    m.service = createProxyFn(m, m.service, existingServicesCheck);

    // proxy .factory calls to the new module
    m.factory = createProxyFn(m, m.factory, existingServicesCheck);

    // proxy .value calls to the new module
    m.value = createProxyFn(m, m.value, existingServicesCheck);

    // proxy .provider calls to the new module
    m.provider = createProxyFn(m, m.provider, existingServicesCheck);

    return m;
  };

}(window.angular));
