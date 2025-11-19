// Karma configuration for unit testing
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-route/angular-route.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'app/**/*.js',
      'tests/**/*.spec.js'
    ],
    exclude: [],
    preprocessors: {
      'app/**/*.js': ['coverage']
    },
    reporters: ['progress', 'coverage', 'kjhtml'],
    coverageReporter: {
      type: 'html',
      dir: 'coverage/',
      subdir: '.'
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    concurrency: Infinity
  });
};

