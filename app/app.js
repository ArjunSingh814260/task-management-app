(function() {
    'use strict';

    angular.module('taskManagementApp', ['ngRoute'])
        .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
            $locationProvider.hashPrefix('');

            $routeProvider
                .when('/login', {
                    templateUrl: 'app/views/login.html',
                    controller: 'LoginController',
                    controllerAs: 'loginCtrl'
                })
                .when('/tasks', {
                    templateUrl: 'app/views/task-list.html',
                    controller: 'TaskListController',
                    controllerAs: 'taskListCtrl',
                    resolve: {
                        auth: ['AuthService', function(AuthService) {
                            return AuthService.requireAuth();
                        }]
                    }
                })
                .when('/tasks/add', {
                    templateUrl: 'app/views/task-form.html',
                    controller: 'TaskFormController',
                    controllerAs: 'taskFormCtrl',
                    resolve: {
                        auth: ['AuthService', function(AuthService) {
                            return AuthService.requireAuth();
                        }]
                    }
                })
                .when('/tasks/edit/:id', {
                    templateUrl: 'app/views/task-form.html',
                    controller: 'TaskFormController',
                    controllerAs: 'taskFormCtrl',
                    resolve: {
                        auth: ['AuthService', function(AuthService) {
                            return AuthService.requireAuth();
                        }]
                    }
                })
                .otherwise({
                    redirectTo: '/login'
                });
        }])
        .run(['$rootScope', '$location', 'AuthService', function($rootScope, $location, AuthService) {
            $rootScope.$on('$routeChangeError', function(event, next, current, error) {
                if (error === 'AUTH_REQUIRED') {
                    $location.path('/login');
                }
            });
        }]);
})();
