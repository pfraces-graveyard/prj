var sh = require('shelljs'),
  lib = require('./lib');

lib.deps(['git']);

var Work = function () {};

Work.prototype.save = function (msg) {
  sh.exec('git add .');
  return !sh.exec('git commit -m "' + msg + '"');
};

Work.prototype.sync = function () {
  return !sh.exec('git push -u origin master');
};

module.exports = new Work();
