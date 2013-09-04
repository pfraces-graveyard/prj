var sh = require('shelljs');

module.exports = {
  deps: function (deps) {
    var failed = deps.filter(function (dep) {
          return !sh.which(dep);
        });

    if (failed.length) {
      sh.echo('Failed to find deps: ' + failed.join(', '));
      sh.exit(1);
    }
  }
};
