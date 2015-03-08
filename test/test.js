/* global window, document, require, QUnit */
var benv = require('benv');
var Q = require('q');

QUnit.module('angular overrides', {
  setup: function () {
    var defer = Q.defer();
    benv.setup(function () {
      defer.resolve();
    });
    return defer.promise;
  },
  teardown: function () {
    benv.teardown();
  }
});

QUnit.test('environment sanity check', function () {
  QUnit.object(window, 'window object exists');
  QUnit.object(document, 'document object exists');
});

QUnit.test('loading angular', function () {
  var angular = benv.require('../bower_components/angular/angular.js', 'angular');
  QUnit.equal(typeof angular, 'object', 'loaded angular');
  QUnit.func(angular.module, 'angular.module is an object');
});

QUnit.test('angular check', function () {
  QUnit.throws(function() {
    benv.require('../stop-angular-overrides.js');
  }, 'Missing angular');
});

QUnit.test('angular.bind', function () {
  var angular = benv.require('../bower_components/angular/angular.js', 'angular');
  QUnit.func(angular.bind, 'angular.bind is a function');
  var foo = {
    name: 'foo',
    getName: function () {
      return this.name;
    }
  };
  var name = angular.bind(foo, foo.getName);
  QUnit.equal(name(), foo.name);
});

QUnit.test('last module overrides by default', function () {
  var angular = benv.require('../bower_components/angular/angular.js', 'angular');
  var first = angular.module('A', []);
  QUnit.equal(angular.module('A'), first, 'A -> first module');

  var second = angular.module('A', []);
  QUnit.equal(angular.module('A'), second, 'A -> second module');
});

QUnit.test('last controller overrides by default', function () {
  var angular = benv.require('../bower_components/angular/angular.js', 'angular');

  var module = angular.module('A', []);
  var First = function () {
    this.name = 'first';
  };
  var Second = function () {
    this.name = 'second';
  };

  module.controller('aController', First);
  module.controller('aController', Second);

  var $controller = angular.injector(['ng', 'A']).get('$controller');
  var pseudoScope = $controller('aController', {$scope: {}});
  QUnit.equal(pseudoScope.name, 'second', 'aController -> second module');

  module.controller('aController');
  $controller = angular.injector(['ng', 'A']).get('$controller');

  QUnit.throws(function() {
    $controller('aController', {$scope: {}});
  }, 'Argument \'aController\' is not a function, got undefined');
});

QUnit.test('last filter overrides by default', function () {
  var angular = benv.require('../bower_components/angular/angular.js', 'angular');

  var module = angular.module('A', []);
  var firstFilter = function () {};
  var secondFilter = function () {};

  module.filter('aFilter', function () { return firstFilter; });
  module.filter('aFilter', function () { return secondFilter; });

  var $filter = angular.injector(['ng', 'A']).get('$filter');
  var loadedFilter = $filter('aFilter');
  QUnit.equal(loadedFilter, secondFilter, 'aFilter -> secondFilter');

  module.filter('aFilter');

  QUnit.throws(function() {
    angular.injector(['ng', 'A']).get('$filter');
  }, 'Error');
});

QUnit.test('stop angular override', function () {
  var angular = benv.require('../bower_components/angular/angular.js', 'angular');
  benv.require('../stop-angular-overrides.js');

  var first = angular.module('A', []);
  QUnit.equal(angular.module('A'), first, 'A -> first module');

  QUnit.throws(function () {
    angular.module('A', []);
  }, 'Error');
});

QUnit.test('stop angular controller override', function () {
  var angular = benv.require('../bower_components/angular/angular.js', 'angular');
  benv.require('../stop-angular-overrides.js');

  angular.module('A1', []).controller('controller', function () {});

  QUnit.throws(function () {
    angular.module('A2', []).controller('controller', function () {});
  }, 'Error');
});

QUnit.test('stop angular filter override', function () {
  var angular = benv.require('../bower_components/angular/angular.js', 'angular');
  benv.require('../stop-angular-overrides.js');

  angular.module('A1', []).filter('f', function () {});

  QUnit.throws(function () {
    angular.module('A2', []).filter('f', function () {});
  }, 'Error');
});
