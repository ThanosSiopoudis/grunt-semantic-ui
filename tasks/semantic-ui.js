/*
 * grunt-semantic-ui
 * https://github.com/ThanosSiopoudis/grunt-semantic-ui
 *
 * Copyright (c) 2015 Thanos Siopoudis and contributors
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');

module.exports = function(grunt) {
    grunt.registerMultiTask('semantic-ui', 'Helps setup semantic-ui in your project', function() {
        debugger;
        var options = this.options(),
            config;

        if (options.config) {
            if (typeof options.config === 'string') {
                if (fs.existsSync(options.config)) {
                    config = JSON.parse(fs.readFileSync(options.config));
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
            if (fs.existsSync(this.theme)) {
                fs.createReadStream(this.theme).pipe(fs.createWriteStream('bower_components/semantic/src/theme.config'));
            }
            else {
                grunt.verbose.warn('Theme file not found, falling back to bundled one.');
            }
        }
        else {
            // Copy our bundled one
            fs.createReadStream('semantic-theme.config').pipe(fs.createWriteStream('bower_components/semantic/src/theme.config'));
        }

        if (!options.dest || options.dest.length < 1) {
            grunt.verbose.warn('Destination not written because no destination path was provided.');
        }

        if (fs.existsSync(this.dest)) {
            // Start the grunt-contrib-less task
            var property = 'less.semantic.files';
            var value = {
                files: getSemanticFiles('bower_components/semantic/src/definitions/', this.dest, config)
            };
            grunt.config(property, value);
            grunt.config('less.semantic.options', { cleancss: false });
            grunt.log.writeln('Compiling less files...');
            grunt.task.run('less:semantic');
        }


    });

    var getSemanticFiles = function(srcDir, outputDir, config) {
        var files = {};
        var getSemanticFilePath = function(ele) {
            return files[outputDir + type + '.' + ele + '.output'] = [srcDir + type + '/' + ele + '.less'];
        };

        for (var type in config) {
            config[type].forEach(getSemanticFilePath);
        }
        return files;
    };
};
