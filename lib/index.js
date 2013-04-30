var optimist = require('optimist')
  , path     = require('path')
  , colors   = require('colors')
  , runner   = require('srunner').create()
  , params   = optimist
       .usage('Generates a starting point for a node.js module'.blue)
       .alias('a', 'author').describe('a', 'author name')
       .alias('c', 'cli').describe('c', 'flag that indicates whether this is a cli application').boolean('c')
       .alias('d', 'desc').describe('d', 'project description')
       .alias('e', 'author-email').describe('e', 'author email')
       .alias('g', 'git-user').describe('g', 'git user name')
       .alias('n', 'name').describe('n', 'project name').demand('n')
       .alias('t', 'type').describe('t', 'module type javascript [js] or coffee-script [cs]').demand('t')
       .alias('l', 'license').describe('l', 'include an MIT license file').boolean('l')
  , argv    = params.argv
  , root    = path.join(__dirname, '..')
  , appRoot = path.resolve(argv.name);

runner
   .init({
        dir   : path.join(root, 'lib')
      , state : { root: root, templates: path.join(root, 'templates') }
      , quiet : true
    })
   .initState(argv)
   .ensureDirExists({ dir: argv.name })
   .ensureDirExists({ dir: path.join(appRoot, 'lib') });

if (argv.type === 'cs') {
    runner.ensureDirExists({ dir: path.join(appRoot, 'src') });
}

if (argv.cli) {
    runner
       .ensureDirExists({ dir: path.join(appRoot, 'bin') })
       .generateFile({ dst: 'bin/' + argv.name, template: 'cli_command', data: argv })
       .makeExecutable({ file: 'bin/' + argv.name });
}

if (argv.license) {
    runner.generateFile({ dst: 'LICENSE', template: 'license' });
}

runner
   .generatePackage(argv)
   .generateFile({ dst: '.gitignore', template: 'gitignore' })
   .generateFile({ dst: 'Makefile', template: 'makefile_' + (argv.js ? 'js' : 'coffee') })
   .generateFile({ dst: 'index.js', data: '//TODO: implement' })
   .generateFile({ dst: 'README.md', template: 'readme', data: argv })
   .run();
