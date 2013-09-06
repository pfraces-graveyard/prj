var sh = require('shelljs'),
  lib = require('./lib');

lib.deps(['git']);

var Work = function (config) {
  if (!(this instanceof Work)) return new Work(config);
  this.config = config;
};

Work.prototype.save = function (msg) {
  sh.exec('git add .');
  return !sh.exec('git commit -m "' + msg + '"');
};

Work.prototype.sync = function () {
  return !sh.exec('git push -u origin master');
};

module.exports = Work;
