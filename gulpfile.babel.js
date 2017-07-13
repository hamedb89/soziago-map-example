'use strict';

import gulp from 'gulp';
import BrowserSync from 'browser-sync';
import webpack from 'webpack-stream';
import named from 'vinyl-named';

const browserSync = BrowserSync.create();

gulp.task('webpack', () => {
	return gulp.src('src/*.js')
		.pipe(named())
		.pipe(webpack({
			devtool: 'source-map',
			module: {
				loaders: [{
					test: /\.js$/,
					exclude: /node_modules/,
					loader: 'babel-loader',
					query: { presets: ['es2015'] }
				}]
			},
			resolve: {
				alias: {
					'react': 'preact-compat',
					'react-dom': 'preact-compat',
				}
			},
			output: { filename: '[name].js' }
		}))
		.pipe(gulp.dest('build/'))
		.pipe(gulp.dest('app/build/'))
		.pipe(browserSync.stream())
		.on('error', function handleError() {
			this.emit('end'); // Recover from errors
		});
});

gulp.task('watch', () => {
	browserSync.init({
		server: 'app',
		files: ['app/build/*.js', 'app/*.html']
	});
	
	gulp.watch('src/*.js', ['webpack']);
});

gulp.task('default', ['webpack', 'watch']);
