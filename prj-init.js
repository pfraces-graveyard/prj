var sh = require('shelljs'),
  lib = require('./lib');

lib.deps(['curl', 'git']);

var Init = function (config) {
  if (!(this instanceof Init)) return new Init(config);
  this.config = config;

  this.config.url = {
    pub: 'https://github.com/' + config.user + '/' + config.repo + '.git',
    priv: 'https://' + config.user + '@github.com/' + config.user + '/' +
      config.repo + '.git'
  };
};

Init.prototype.clone = function () {
  return !sh.exec('git clone ' + this.config.url.priv).code;
};

Init.prototype.remote = function () {
  var cmd = 'curl -u ' + this.config.user +
    ' https://api.github.com/user/repos -d \'{"name":"' + this.config.repo +
    '"}\'';

  return !sh.exec(cmd).code;
};

Init.prototype.doc = function () {
  var doc = '# ' + this.config.repo + '\n' + this.config.desc + '\n';
  return doc;
};

Init.prototype.manifest = function () {
  var config = this.config;

  var manifest = {
    name: config.repo,
    version: config.version || '0.1.0',
    description: config.desc,
    main: config.repo + '.js',
    bin: {},
    dependencies: {},
    repository: {
      type: 'git',
      url: this.config.url.pub
    },
    keywords: [],
    author: config.user,
    license: 'BSD'
  };

  return JSON.stringify(manifest, null, 2);
};

Init.prototype.repo = function () {
  var repo = this.config.repo,
    user = this.config.user;

  if (sh.test('-e', repo)) {
    sh.echo('path exists: ' + repo);
    sh.exit(1);
  }

  return !sh.exec('git init ' + repo).code;
};

Init.prototype.link = function () {
  return !sh.exec('git remote add origin ' + this.config.url.priv);
};

module.exports = Init;
