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
        },
        copy: {
            dev: {
                files: [
                    {   // everything but js, since we'll deal with that separately
                        expand: true,
                        src: [ 'app/**', '!/app/**/*.js'],
                        dest: 'dev/'
                    }
                ],
                options: {
                    process: function (content, srcpath) {
                        if (srcpath == 'app/index.html') {
                            return replaceIndexPaths(content, 'dev');
                        }
                    }
                }
            },
            prod: {
                files: [
                    {   // everything but js, since we'll deal with that separately
                        expand: true,
                        src: [ 'app/**', '!/app/**/*.js'],
                        dest: 'www/'
                    }
                ]
            }
        }

    });

    var replaceIndexPaths = function(content, parentDest) {

        // lib stuff

        content.replace(/data-main="main"/g, 'data-main')
    };

    // Load the plugin that provides the "durandaljs" task.
    grunt.loadNpmTasks('grunt-durandaljs');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['durandaljs']);

};
