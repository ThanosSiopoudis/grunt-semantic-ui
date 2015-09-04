'use strict';

module.exports = function(grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.initConfig({
        'semantic-ui': {
            all: {
                options: {
                    config: 'test/config.json',
                    dest: 'test/fixtures/public/'
                }
            }
        }
    });

    grunt.registerTask('default', ['semantic-ui']);
    grunt.registerTask('test', ['semantic-ui']);
    grunt.loadTasks('tasks');
};
