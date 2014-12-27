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
                    output: 'dev/main.js',
                    almond: true
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
        clean: {
            dev: ['dev/'],
            prod: ['www/']
        },
        copy: {
            dev: {
                files: [
                    {   // everything but js, since we'll deal with that separately
                        expand: true,
                        cwd: 'app/',
                        src: [ '**', '!**/*.js', '!**/js', '!**/viewmodels'],
                        dest: 'dev/'
                    }
                ],
                options: {
                    process: function (content, srcpath) {
                        if (srcpath == 'app/index.html') {
                            console.log('replacing index text');
                            // reference the built version
                            return content.replace('"../lib/require/require.js"', '"main.js"')
                        }

                        return content;
                    }
                }
            },
            prod: {
                files: [
                    {   // everything but js, since we'll deal with that separately
                        expand: true,
                        cwd: 'app/',
                        src: [ '**', '!**/*.js', '!**/js', '!**/viewmodels'],
                        dest: 'www/'
                    }
                ],
                options: {
                    process: function (content, srcpath) {
                        if (srcpath == 'app/index.html') {
                            console.log('replacing index text');
                            // reference the built version
                            return content.replace('"../lib/require/require.js"', '"main.js"')
                        }

                        return content;
                    }
                }
            }
        }

    });

    // Load the plugin that provides the "durandaljs" task.
    grunt.loadNpmTasks('grunt-durandaljs');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    //grunt.registerTask('default', ['durandaljs']);

    grunt.registerTask('default', [
        'clean:dev',
        'copy:dev',
        'durandaljs:dev'

    ]);

    grunt.registerTask('build', [
        'clean:prod',
        'copy:prod',
        'durandaljs:prod'
    ]);

};
