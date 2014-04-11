# stop-angular-overrides

> Stop silent Angular module / controller / function overrides

`bower install stop-angular-overrides --save`

```
<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/stop-angular-overrides/stop-angular-overrides.js"></script>
<script src="A1.js"></script> // angular.module('A', []) ...
<script src="A2.js"></script> // angular.module('A', []) ... !!!
// results in
Uncaught Error: Angular module A already exists prevent-module-override.js:17
  angular.module prevent-module-override.js:17
  A2 A2.js:3
  (anonymous function)
``

Basically maintains lightweight cache of registered angular names
to prevent collision. Any attempt to override existing module / controller / filter
results in an exception with details. Make sure to use function names when
registering modules to get meaningful stack for easier debugging.
This script is good for debugging environment, probably not necessary to run
in production.

### Small print

Author: Gleb Bahmutov &copy; 2014

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://bahmutov.calepin.co/)

License: MIT - do anything with the code, but don't blame me if it does not work.

Spread the word: tweet, star on github, etc.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/stop-angular-overrides/issues) on Github

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
