#!/usr/bin/env node

var 
  optimist = require('optimist'),
  sh = require('shelljs'),
  Init = require('./prj-init'),
  Work = require('./prj-work');

var arg = optimist
  .usage('Project management tool')
  .option('h', {
    alias: 'help',
    describe: 'Show this help'
  })
  .option('i', {
    alias: 'init',
    describe: 'Clone an existing repo or create both local and remote repos',
  })
  .option('s', {
    alias: 'save',
    describe: 'Commit changes and sync with remote repo',
  })
  .option('b', {
    alias: 'bump',
    describe: 'Bump project version',
  }).argv;

if (arg.help) {
  optimist.showHelp();
  sh.exit();
}

if (arg.init) {
  var prj = Init(arg.init);

  if (!prj.clone()) {
    prj.repo();
    
    sh.cd(arg.init.repo);
    sh.echo(prj.manifest()).to('package.json');
    sh.echo(prj.doc()).to('README.md');

    prj.remote();
    prj.link();

    Work().save('auto generated');
    Work().sync();
  };
} else if (arg.save) {
  Work().save(arg.save);
  Work().sync();
}
