const gulp = require( 'gulp' );
const sass = require( 'gulp-sass' );
const autoprefixer = require( 'gulp-autoprefixer' );
const del = require( 'del' );
const rollup = require( 'rollup' ).rollup;
const babel = require( 'rollup-plugin-babel' )
const commonjs = require( 'rollup-plugin-commonjs' );
const nodeResolve = require( 'rollup-plugin-node-resolve' );
const eslint = require( 'rollup-plugin-eslint' );
const uglify = require( 'rollup-plugin-uglify' );
const package = require( './package.json' );

function dev() {

  return rollup({
    entry: 'src/index.js',
    plugins: [
      eslint(),
      nodeResolve({ jsnext: true }),
      commonjs(),
      babel({
        exclude: 'node_modules/**'
      })
    ]
  }).then( function( bundle ) {

    return bundle.write({
      dest: 'dist/vidim.js',
      format: 'umd',
      moduleName: 'vidim',
      sourceMap: true
    });

  });

};

function devWatch() {

  dev();

  gulp.watch( 'src/**/*.js', dev );

};

function cleanDistFolder() {

  return del([
    'dist/**/*'
  ]);

}

function build() {

  cleanDistFolder();

  var date = new Date;

  var banner =
    '/* \n' +
    ' * vidim v' + package.version + '\n' +
    ' * ' + date.toISOString() + '\n' +
    ' * https://github.com/OriginalEXE/vidim \n' +
    ' * \n' +
    ' * Made by Ante Sepic \n' +
    ' */';

  return rollup({
    entry: 'src/index.js',
    plugins: [
      eslint(),
      nodeResolve({ jsnext: true }),
      commonjs(),
      babel({
        exclude: 'node_modules/**'
      }),
      uglify({
        output: {
          comments: function( node, comment ) {

            if ( 'comment2' === comment.type ) {

              return /Made by Ante Sepic/.test( comment.value );

            }

          }
        }
      })
    ]
  }).then( function( bundle ) {

    return bundle.write({
      dest: 'dist/vidim.min.js',
      format: 'umd',
      moduleName: 'vidim',
      sourceMap: false,
      banner: banner
    });

  }).then( function() {

    return rollup({
      entry: 'src/index.js',
      plugins: [
        eslint(),
        nodeResolve({ jsnext: true }),
        commonjs(),
        babel({
          exclude: 'node_modules/**'
        })
      ]
    });

  }).then( function( bundle ) {

    return bundle.write({
      dest: 'dist/vidim.js',
      format: 'umd',
      moduleName: 'vidim',
      sourceMap: false,
      banner: banner
    });

  });

}

function docs() {

  docsSass();

  gulp.watch( 'docs/scss/**/*.scss', docsSass );

}

function docsSass() {

  return gulp.src( 'docs/scss/main.scss' )
    .pipe(
      sass({
        outputStyle: 'compressed'
      })
    )
    .pipe(
      autoprefixer({
        browsers: ['last 3 versions']
      })
    )
    .pipe( gulp.dest( 'docs/css' ) );

}

exports.dev = dev;
exports.devWatch = devWatch;
exports.build = build;
exports.docs = docs;
exports.docsSass = docsSass;
