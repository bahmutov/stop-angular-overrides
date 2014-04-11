(function stopAngularOverrides(angular) {
  'use strict';

  if (!angular) {
    throw new Error('Missing angular');
  }

  var _module = angular.module.bind(angular);

  var existingModules = Object.create(null);

  angular.module = function (name, deps) {
    if (!deps) {
      return _module(name);
    }
    if (existingModules[name]) {
      throw new Error('Angular module ' + name + ' already exists');
    }
    existingModules[name] = true;
    return _module(name, deps);
  };

}(window.angular));
