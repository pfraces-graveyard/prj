#!/usr/bin/env node

var optimist = require('optimist'),
  sh = require('shelljs'),
  Init = require('./prj-init'),
  work = require('./prj-work');

var arg = optimist
  .usage('Project management tool')
  .option('h', {
    alias: 'help',
    describe: 'Show this help'
  })
  .option('v', {
    alias: 'version',
    describe: 'Show version'
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
  var init = Init(arg.init);
  init.clone() && sh.exit();

  init.repo();
  
  sh.cd(arg.init.repo);
  sh.echo(init.manifest()).to('package.json');
  sh.echo(init.doc()).to('README.md');

  init.remote();
  init.link();

  work.save('auto generated');
  work.sync();
  sh.exit();
}

if (arg.save) {
  if (!arg.save.length) {
    console.log('Aborting commit due to empty commit message.');
    sh.exit(1);
  }

  work.save(arg.save);
  work.sync();
  sh.exit();
}
