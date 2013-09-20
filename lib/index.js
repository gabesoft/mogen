var optimist = require('optimist')
  , path     = require('path')
  , colors   = require('colors')
  , srunner  = require('srunner')
  , log      = new srunner.Logger({ keepBlankLines: true })
  , runner   = srunner.create({ log: log })
  , params   = optimist
       .usage('Generates a starting point for a node.js module\n'.cyan + 'Usage mogen [options]'.blue)
       .alias('a', 'author').describe('a', 'author name')
       .alias('c', 'cli').describe('c', 'indicates whether this is a cli application').boolean('c')
       .alias('d', 'desc').describe('d', 'project description')
       .alias('e', 'author-email').describe('e', 'author email')
       .alias('g', 'git-user').describe('g', 'git user name')
       .alias('l', 'license').describe('l', 'indicates whether to include an MIT license file').boolean('l')
       .alias('n', 'name').describe('n', 'project name')
       .alias('t', 'type').describe('t', 'module type <javascript [js] or coffee-script [cs]>')
       .alias('h', 'help').describe('h', 'displays usage').boolean('h')
       .alias('v', 'version').describe('v', 'displays the current version').boolean('v')
  , argv    = params.argv
  , root    = path.join(__dirname, '..')
  , appRoot = path.resolve(argv.name || '')
  , pack    = require(path.join(__dirname, '..', 'package.json'))
  , help    = function () {
        var lines = params.help().split('\n');
        lines.splice(12, 0, '');
        lines.unshift('');
        return lines.join('\n');
    };

if (argv.version) {
    console.log(pack.version);
    process.exit(0);
}

if (argv.help) {
    log.help(help());
    process.exit(0);
}

if (!argv.type || !argv.n) {
    log.help(help());
    log.warn('--name and --type options are required');
    log.help();
    process.exit(0);
}

argv.type = (argv.type === 'coffee' ? 'cs' : argv.type);
argv.type = (argv.type === 'javascript' ? 'js' : argv.type);

runner
   .init({
        dir   : path.join(root, 'lib')
      , state : { 
            root      : root
          , templates : path.join(root, 'templates') 
          , appRoot   : path.resolve(argv.name)
          , name      : argv.name
        }
      , quiet : true
    })
   .ensureDirExists({ dir: argv.name })
   .ensureDirExists({ dir: path.join(appRoot, 'lib') });

if (argv.cli) {
    runner
       .ensureDirExists({ dir: path.join(appRoot, 'bin') })
       .generateFile({ dst: 'bin/' + argv.name, template: 'cli_command', data: argv })
       .makeExecutable({ file: 'bin/' + argv.name });
}

if (argv.license) {
    runner.generateFile({ dst: 'LICENSE', template: 'license' });
}

if (argv.type === 'cs') {
    runner.ensureDirExists({ dir: path.join(appRoot, 'src') });
    runner.generateFile({ dst: 'src/index.coffee', template: 'index_cs' })
} else {
    runner.generateFile({ dst: 'lib/index.js', template: 'index_js' })
}

runner
   .generatePackage(argv)
   .generateFile({ dst: '.gitignore', template: 'gitignore' })
   .generateFile({ dst: 'Makefile', template: 'makefile_' + argv.type })
   .generateFile({ dst: 'README.md', template: 'readme', data: argv })
   .run();
