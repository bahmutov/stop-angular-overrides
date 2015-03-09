# stop-angular-overrides

> Stop silent Angular module / controller / function overrides

[![Build status][stop-angular-overrides-ci-image] ][stop-angular-overrides-ci-url]
[![Coverage Status][stop-angular-overrides-coverage-image]][stop-angular-overrides-coverage-url]
[![dependencies][stop-angular-overrides-dependencies-image] ][stop-angular-overrides-dependencies-url]
[![devdependencies][stop-angular-overrides-devdependencies-image] ][stop-angular-overrides-devdependencies-url]

`bower install stop-angular-overrides --save`

```
<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/stop-angular-overrides/stop-angular-overrides.js"></script>
<script src="A1.js"></script> // angular.module('A', []) ...
<script src="A2.js"></script> // angular.module('A', []) ... !!!
// results in
Uncaught Error: Angular module A already exists stop-module-override.js:17
  angular.module stop-module-override.js:17
  A2 A2.js:3
  (anonymous function)
```

Basically maintains lightweight cache of registered angular names
to prevent collision. Any attempt to override existing module / controller / filter / service
results in an exception with details. Make sure to use function names when
registering modules to get meaningful stack for easier debugging.
This script is good for debugging environment, probably not necessary to run
in production.

Namespacing other conventions are good practice, but not really
enforceable 100%, so I created this script. It prevents run-time overriding via these calls

* angular.module
* angular.filter (across all filter names)
* angular.controller (across all controller names)
  * for now works with array format `.controller('foo', ['dep1', 'dep2', ..., fn]);`
* angular.service (across all service names)
  * service names are checked for all functions that create services (service, factory, provider, value)
* angular.factory (across all service names)
* angular.provider (across all service names)
* angular.value (across all service names)
* angular.directive (across all directive names)

## Overriding entities in Angular

The overriding situation in Angular becomes terrible and hair-pulling as soon as you
have several people working on the same web app. Name clashes can happen anywhere
and result in silent and very non-obvious failures. Here is an example where the
second module with the same name wins:

```js
angular.module('A', [])
.directive('aDirective', function () {
  return {
    restrict: 'E',
    template: '<div>module A: a-directive</div>'
  };
}).filter('F', function () {
  return function () { return 'F'; };
});

angular.module('A', [])
}).filter('F', function () {
  return function () { return 'F2'; };
});
```

Last registered entity with same name wins. In this case, second module with
name A and filter F wins. To avoid the situation, we can change each module to
have a different name. What about filters? They can clash across modules!
This might be a design decision (allows overriding logic based on the closes module),
but definitely causes weird behavior:

```js
angular.module('A', [])
.directive('aDirective', function () {
  return {
    restrict: 'E',
    template: '<div>module A: a-directive, filter result {{ 22 | F }}</div>'
  };
}).filter('F', function () {
  return function () { return 'F'; };
});

angular.module('A2', [])
.controller('A2Ctrl', function () {})
.filter('F', function () {
  return function () { return 'F2'; };
});
```

Module A includes a directive which uses filter F. Second module A2
includes a controller and also a filter with name F. Which filter would be
used in side the `<a-directive>`? Depends on which controller is closest!

```html
<div ng-controller="A2Ctrl">
  <a-directive></a-directive>
</div>
```

`module A: a-directive, filter result F2`

Even creating a controller for the `a-directive` does not help, the second
unrelated module wins just because it surrounds the element on the page. Madness.

## Unit testing

I unit tested the script using browser simulation under Nodejs.
See my [blog post](http://bahmutov.calepin.co/unit-testing-angular-load-using-node.html)
and [test.js](test/test.js)

### Small print

Author: Gleb Bahmutov &copy; 2014

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://bahmutov.calepin.co/)

License: MIT - do anything with the code, but don't blame me if it does not work.

Spread the word: tweet, star on github, etc.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/stop-angular-overrides/issues) on Github

### Contributors

* [Gleb Bahmutov](https://github.com/bahmutov)
* [Tilman Potthof](https://github.com/tilmanpotthof)

## MIT License

Copyright (c) 2014 Gleb Bahmutov

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[stop-angular-overrides-icon]: https://nodei.co/npm/stop-angular-overrides.png?downloads=true
[stop-angular-overrides-url]: https://npmjs.org/package/stop-angular-overrides
[stop-angular-overrides-ci-image]: https://travis-ci.org/bahmutov/stop-angular-overrides.png?branch=master
[stop-angular-overrides-ci-url]: https://travis-ci.org/bahmutov/stop-angular-overrides
[stop-angular-overrides-coverage-image]: https://coveralls.io/repos/bahmutov/stop-angular-overrides/badge.png
[stop-angular-overrides-coverage-url]: https://coveralls.io/r/bahmutov/stop-angular-overrides
[stop-angular-overrides-dependencies-image]: https://david-dm.org/bahmutov/stop-angular-overrides.png
[stop-angular-overrides-dependencies-url]: https://david-dm.org/bahmutov/stop-angular-overrides
[stop-angular-overrides-devdependencies-image]: https://david-dm.org/bahmutov/stop-angular-overrides/dev-status.png
[stop-angular-overrides-devdependencies-url]: https://david-dm.org/bahmutov/stop-angular-overrides#info=devDependencies
