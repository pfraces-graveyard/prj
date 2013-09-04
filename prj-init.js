#!/usr/bin/env node

var optimist = require('optimist'),
    sh = require('shelljs'),
    lib = require('./lib.js');

var arg = optimist
  .usage('Initialize a git repository with github mirror')
  .option('h', {
    alias: 'help',
    describe: 'Show this help'
  })
  .option('r', {
    alias: 'repo',
    describe: 'Remote repository to sync with',
    demand: true
  })
  .option('o', {
    alias: 'owner',
    describe: 'Remote repository owner',
    demand: true
  })
  .option('d', {
    alias: 'desc',
    describe: 'Project description',
    demand: true
  }).argv;

if (argv.help) {
  optimist.showHelp();
  sh.exit();
}

lib.deps(['curl', 'git']);

var createRemoteRepo = function () {
  var err = sh.exec('git clone https://' + argv.owner + '@github.com/' + 
                 argv.owner + '/' + argv.repo + '.git')
              .code;

  if (!err) sh.exit();

  sh.exec('curl -u ' + argv.owner + ' https://api.github.com/user/repos ' +
       '-d \'{"name":"' + argv.repo + '"}\'');
};

var createReadme = function () {
  sh.echo('# ' + argv.repo + '\n' + argv.desc + '\n').to('README.md');
};

var createPackageJson = function () {
  var package = {
        name: argv.repo,
        version: argv.version || '0.1.0',
        description: argv.desc,
        main: argv.repo + '.js',
        bin: {},
        dependencies: {},
        repository: {
          type: 'git',
          url: 'https://github.com/' + argv.owner + '/' + argv.repo + '.git'
        },
        keywords: [],
        author: argv.owner,
        license: 'BSD'
      };

  sh.echo(JSON.stringify(package, null, 2)).to('package.json');
};

var createLocalRepo = function () {
  var repo = argv.repo,
      owner = argv.owner;

  if (sh.test('-e', repo)) {
    sh.echo('Path exists: ' + repo + ' exists');
    sh.exit(2);
  }

  sh.mkdir(repo);
  sh.cd(repo);
  sh.exec('git init');

  createReadme();
  createPackageJson();
  sh.exec('git add .');

  sh.exec('git commit -m "Initial commit"');
  sh.exec('git remote add origin https://' + owner + '@github.com/' + owner +
          '/' + repo + '.git');

  sh.exec('git push -u origin master');
};

createRemoteRepo();
createLocalRepo();
