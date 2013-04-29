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
   .ensureDirExists({ dir: argv.name, quiet: false })
   .ensureDirExists({ dir: path.join(appRoot, 'lib'), quiet: false });

if (argv.type === 'cs') {
    runner.ensureDirExists({ dir: path.join(appRoot, 'src'), quiet: false });
}

if (argv.cli) {
    runner
       .ensureDirExists({ dir: path.join(appRoot, 'bin'), quiet: false })
       .generateCommand()
       .makeExecutable(path.join(appRoot, 'bin', argv.name));
}

runner
   .copyTemplate({ src: 'gitignore', dst: '.gitignore' })
   .generateMakefile(argv)
   .copyTemplate({ src: null, dst: 'index.js', data: '//TODO: implement' })
   .generatePackage(argv)
   .copyTemplate({ src: 'license', dst: 'LICENSE' })
   .copyTemplate({ src: 'readme', dst: 'README.md', data: argv });
   .run();
