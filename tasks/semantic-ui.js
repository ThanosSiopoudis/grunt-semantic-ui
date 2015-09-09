/*
 * grunt-semantic-ui
 * https://github.com/ThanosSiopoudis/grunt-semantic-ui
 *
 * Copyright (c) 2015 Thanos Siopoudis and contributors
 * Licensed under the MIT license.
 */

'use strict';

var less = require('less');
var async = require('async');
var path = require('path');

module.exports = function(grunt) {
    grunt.registerMultiTask('semantic-ui', 'Helps setup semantic-ui in your project', function() {
        var done = this.async(),
            options = this.options(),
            config,
            baseDir = path.normalize(__dirname + '/..');

        if (options.config) {
            if (typeof options.config === 'string') {
                if (grunt.file.exists(options.config)) {
                    config = grunt.file.readJSON(options.config);
                }
                else {
                    grunt.fail.warn('The Semantic-UI configuration file does not exist.');
                    return false;
                }
            }
            else if (typeof options.config === 'object') {
                config = options.config;
            }
            else {
                grunt.fail.warn('Could not find the Semantic-UI configuration object.');
                return false;
            }
        }

        if (this.theme && this.theme.length) {
            if (grunt.file.exists(this.theme)) {
                grunt.file.copy(this.theme, baseDir + '/bower_components/semantic/src/theme.config');
            }
            else {
                grunt.verbose.warn('Theme file not found, falling back to bundled one.');
            }
        }
        else {
            // Copy our bundled one
            grunt.file.copy(baseDir + '/semantic-theme.config', baseDir + '/bower_components/semantic/src/theme.config');
        }

        if (!options.dest || options.dest.length < 1) {
            grunt.verbose.warn('Destination not written because no destination path was provided.');
        }

        // Start the grunt-contrib-less task
        var semanticFilePaths = getSemanticFiles(baseDir + '/bower_components/semantic/src/definitions/', options.dest, config);
        var compiled = [];
        var dest = options.dest + 'css/semantic-ui.css';
        async.concatSeries(semanticFilePaths, function(f, nextFile) {
            var src = f.src;

            if (!grunt.file.exists(src)) {
                grunt.log.warn('Source file "' + f.src + '" not found.');
            }

            var options = {filename: src};
            var sourceCode = grunt.file.read(src);
            grunt.log.write('Compiling "' + path.basename(src) + '"...');
            less.render(sourceCode, options)
                .then(function(output) {
                    compiled.push(output.css);
                    grunt.log.write('done!');
                    grunt.log.writeln();
                    process.nextTick(nextFile);
                },
                function(err) {
                    nextFile(err);
                }
            );

        }, function() {
            if (compiled.length < 1) {
                grunt.log.warn('Destination "' + dest + '" not written becaused the compiled files were empty.');
            }
            else {
                var allCss = compiled.join(grunt.util.normalizelf(grunt.util.linefeed));
                grunt.file.write(dest, allCss);
                grunt.log.writeln('File ' + dest + ' created.');
            }

            // Now, copy over the js file and the assets
            // then we should be done
            var jsModules = getSemanticModules(baseDir + '/bower_components/semantic/src/definitions/', config);
            var compiledJs = [];
            jsModules.forEach(function(mod) {
                compiledJs.push(grunt.file.read(mod));
            });
            var allJs = compiledJs.join(grunt.util.normalizelf(grunt.util.linefeed));
            grunt.file.write(options.dest + 'scripts/semantic.js', allJs);
            grunt.log.writeln('File ' + options.dest + 'scripts/semantic.js Created');

            // Assets
            // TODO: copy over assets from all used (or option-defined) themes
            var themeAssets = grunt.file.expandMapping('**/*.*', options.dest + 'themes/default/assets/', {
                cwd: baseDir + '/bower_components/semantic/src/themes/default/assets'
            });
            themeAssets.forEach(function(file) {
                grunt.file.copy(file.src[0], file.dest);
            });

            done();
        });
    });

    var getSemanticFiles = function(srcDir, outputDir, config) {
        var files = [];
        var getSemanticFilePath = function(ele) {
            var item = {
                src: srcDir + type + '/' + ele + '.less'
            };
            return files.push(item);
        };

        for (var type in config) {
            config[type].forEach(getSemanticFilePath);
        }
        return files;
    };

    var getSemanticModules = function(srcDir, config) {
        var files = [];
        var getSemanticFilePath = function(ele) {
            return files.push(srcDir + type + '/' + ele + '.js');
        };

        for (var type in config) {
            if (type !== 'modules') {
                continue;
            }
            config[type].forEach(getSemanticFilePath);
        }
        return files;
    };
};
