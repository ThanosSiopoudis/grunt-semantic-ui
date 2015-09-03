'use strict';

module.exports = function(grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.initConfig({
        'semantic-ui': {
            all: {
                options: {
                    config: 'test/fixtures/config.json',
                    dest: 'test/fixtures/public/css'
                }
            }
        }
    });

    grunt.registerTask('default', ['semantic-ui']);
    grunt.loadTasks('tasks');
};
