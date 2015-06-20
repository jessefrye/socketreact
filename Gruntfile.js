
module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        watch: {
            react: {
                files: 'client/components/*.js',
                tasks: ['browserify']
            },
            css : {
                files : ['client/sass/*.scss', 'client/sass/**/*.scss'],
                tasks: ['sass']
            }
        },

        browserify: {
            options: {
                transform: [ require('grunt-react').browserify ]
            },
            app: {
                src: ['client/app.js'],
                dest: 'client/js/bundle.js'
            }
        },
        sass: {
        	options: { sourceMap: true },
        	dist: {
        		files: { 'client/css/styles.css' : 'client/sass/sass.scss' }
        	}
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', [
        'browserify', 'sass'
        ]);
    };
