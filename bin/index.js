#!/usr/bin/env node
const yargs = require('yargs');
const fs = require('fs');
const path = require('path');
const exactDeps = require('../');

// eslint-disable-next-line prefer-destructuring,no-unused-expressions
yargs
  .usage('$0 [file]')
  .command({
    command: ['* [file]', 'update [file]'],
    desc: 'Update file to include exact dependency versions',
    builder(localYargs) {
      return localYargs.options({
        p: {
          alias: 'prefix',
          description: 'Version prefix (^, >, etc.)',
          type: 'string',
        },
      });
    },
    handler(argv) {
      const { path: filepath, package: pkg } = exactDeps(
        argv.file ? path.resolve(argv.file) : undefined,
        argv.prefix
      );
      fs.writeFileSync(filepath, JSON.stringify(pkg, null, 2));
      console.log(`✨  Dependency versions updated`);
    },
  })
  .alias('h', 'help')
  .help('help')
  .strict().argv;
