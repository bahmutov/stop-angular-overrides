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

QUnit.test('last service overrides by default', function () {
  var angular = benv.require('../bower_components/angular/angular.js', 'angular');

  var module = angular.module('A', []);
  var ServiceA = function () {
    this.name = 'ServiceA';
  };
  var ServiceB = function () {
    this.name = 'ServiceB';
  };

  // initial definition
  module.service('someService', ServiceA);

  // first override
  module.service('someService', ServiceB);

  var someService = angular.injector(['ng', 'A']).get('someService');
  QUnit.equal(someService.name, 'ServiceB', 'someService -> second service');

  // undefined override
  module.service('someService');

  QUnit.throws(function() {
    angular.injector(['ng', 'A']).get('someService');
  }, 'Error');

  // value override
  module.value('someService', new ServiceA());
  someService = angular.injector(['ng', 'A']).get('someService');
  QUnit.equal(someService.name, 'ServiceA', 'someService -> third service');

  // factory override
  module.factory('someService', function () {
    return new ServiceB();
  });
  someService = angular.injector(['ng', 'A']).get('someService');
  QUnit.equal(someService.name, 'ServiceB', 'someService -> fourth service');

  // provider override
  module.provider('someService', function () {
    this.$get = function () {
      return new ServiceA();
    };
  });
  someService = angular.injector(['ng', 'A']).get('someService');
  QUnit.equal(someService.name, 'ServiceA', 'someService -> fifth service');
});
