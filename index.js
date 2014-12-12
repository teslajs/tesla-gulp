var app = {},
    path = require('path');

require(path.resolve('./config/_settings'))(app);
require(path.resolve('./config/environment/development'))(app);

var browserSync = require('browser-sync'),
    gulp        = require('gulp'),
    nodemon     = require('gulp-nodemon'),
    reload      = browserSync.reload,
    paths       = {
      app   : 'server.js',
      build : app.config.system.build,
      css   : app.config.system.public + 'css/**/*.css',
      img   : app.config.system.public + 'img/**/*',
      js    : [app.config.system.public + 'js/**/*', 'app/**/*.js'],
      less  : app.config.system.public + 'css/**/*.less',
      lib   : app.config.system.public + 'lib/**/*'
    };


// DEFAULT TASK, HANDLES ALL BASIC SERVER STUFF
gulp.task('tesla', ['teslaBrowserSync'], function () {
  gulp.watch(paths.css, [reload]);
  gulp.watch(paths.js, [reload]);
});


// BROWSER SYNC
gulp.task('teslaBrowserSync', ['teslaNodemon'], function() {

  if ( app.config.browserSync ) {
    console.log('Running gulp task "BS"');

    browserSync.init(null, {
      proxy: 'http://localhost:' + app.config.server.port,
      files: app.config.browserSync.files,
      open: app.config.browserSync.open,
      port: app.config.browserSync.port,
      notify: app.config.browserSync.notify
    });
  }

});


// NODEMON
gulp.task('teslaNodemon', function (cb) {
  var called = false;
  return nodemon({
    script: paths.app,
    ext: 'js, hbs, less',
    ignore: ['README.md', 'node_modules/**', '.DS_Store']
  }).on('start', function () {
    if (!called) {
      called = true;
      cb();
    }
  })
  .on('restart', function () {
    setTimeout(function () {
      reload({ stream: false });
    }, 1000);
  });
});
