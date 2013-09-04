#!/usr/bin/env node

var optimist = require('optimist'),
    sh = require('shelljs'),
    lib = require('./lib.js');

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

lib.deps(['curl', 'git']);

var cmd = {
  name: '',
  args: process.argv.slice(3).join(' ')
};

if (arg.init) cmd.name = 'init'
else sh.exit();

sh.exec('node ' + __dirname + '/prj-' + cmd.name + '.js ' + cmd.args);
