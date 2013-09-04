#!/usr/bin/env node

require('shelljs/global');

var optimist = require('optimist')
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
    }),
    argv = optimist.argv;

if (argv.help) {
  optimist.showHelp();
  exit();
}

var deps = function (deps) {
  var failed = deps.filter(function (dep) {
        return !which(dep);
      });

  if (failed.length) {
    console.log('Failed to find deps: ' + failed.join(', '));
    exit(1);
  }
};

deps(['curl', 'git']);

// no usar
//   config.silent = true;
// hasta pasar el passwd automaticamente

var createRemoteRepo = function () {
  exec('git clone https://' + argv.owner + '@github.com/' + argv.owner + '/' +
       argv.repo + '.git');

  if (!error()) exit();

  exec('curl -u ' + argv.owner + ' https://api.github.com/user/repos ' +
       '-d \'{"name":"' + argv.repo + '"}\'');
};

var createReadme = function () {
  echo('# ' + argv.repo + '\n' + argv.desc + '\n').to('README.md');
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

  echo(JSON.stringify(package, null, 2)).to('package.json');
};

var createLocalRepo = function () {
  var repo = argv.repo,
      owner = argv.owner;

  if (test('-e', repo)) {
    console.log('Path exists: ' + repo + ' exists');
    exit(2);
  }

  mkdir(repo);
  cd(repo);
  exec('git init');

  createReadme();
  createPackageJson();
  exec('git add .');

  exec('git commit -m "Initial commit"');
  exec('git remote add origin https://' + owner + '@github.com/' + owner +
      '/' + repo + '.git');

  exec('git push -u origin master');
};

createRemoteRepo();
createLocalRepo();
