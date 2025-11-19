(function() {
    'use strict';

    angular.module('taskManagementApp')
        .service('AuthService', ['$http', '$q', '$window', function($http, $q, $window) {
            var TOKEN_KEY = 'task_management_token';
            var USER_KEY = 'task_management_user';
            var API_URL = 'https://jsonplaceholder.typicode.com';

            this.login = function(credentials) {
                var deferred = $q.defer();

                setTimeout(function() {
                    if (credentials.username && credentials.password) {
                        var mockToken = btoa(JSON.stringify({
                            username: credentials.username,
                            exp: Date.now() + (24 * 60 * 60 * 1000)
                        }));

                        $window.localStorage.setItem(TOKEN_KEY, mockToken);
                        $window.localStorage.setItem(USER_KEY, credentials.username);

                        deferred.resolve({
                            token: mockToken,
                            user: credentials.username
                        });
                    } else {
                        deferred.reject({
                            message: 'Username and password are required'
                        });
                    }
                }, 500);

                return deferred.promise;
            };

            this.logout = function() {
                $window.localStorage.removeItem(TOKEN_KEY);
                $window.localStorage.removeItem(USER_KEY);
            };

            this.isAuthenticated = function() {
                var token = $window.localStorage.getItem(TOKEN_KEY);
                if (!token) {
                    return false;
                }

                try {
                    var tokenData = JSON.parse(atob(token));
                    if (tokenData.exp && tokenData.exp < Date.now()) {
                        this.logout();
                        return false;
                    }
                    return true;
                } catch (e) {
                    this.logout();
                    return false;
                }
            };

            this.getCurrentUser = function() {
                return $window.localStorage.getItem(USER_KEY) || null;
            };

            this.getToken = function() {
                return $window.localStorage.getItem(TOKEN_KEY);
            };

            this.requireAuth = function() {
                var deferred = $q.defer();

                if (this.isAuthenticated()) {
                    deferred.resolve();
                } else {
                    deferred.reject('AUTH_REQUIRED');
                }

                return deferred.promise;
            };
        }]);
})();
