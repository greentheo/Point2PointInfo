module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        durandaljs: {
            options: {
                extraModules: [
                    'plugins/dialog',
                    'plugins/observable',
                    'transitions/entrance'
                ]
            },
            dev: {
                options: {
                    output: 'dev/main.js'
                }
            },
            prod: {
                options: {
                    output: 'www/main.js',
                    almond: true,
                    minify: true
                }
            }
        }

    });

    // Load the plugin that provides the "durandaljs" task.
    grunt.loadNpmTasks('grunt-durandaljs');

    // Default task(s).
    grunt.registerTask('default', ['durandaljs']);

};