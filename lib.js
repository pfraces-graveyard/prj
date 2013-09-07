var sh = require('shelljs');

var Lib = function () {};

Lib.prototype.deps = function (deps) {
  var failed = deps.filter(function (dep) {
    return !sh.which(dep);
  });

  if (failed.length) {
    sh.echo('Failed to find deps: ' + failed.join(', '));
    sh.exit(1);
  }
};

Lib.prototype.out = function (data) {
  //sh.echo(JSON.stringify(data, null, 2));
  sh.echo(data);
};

module.exports = Lib;
