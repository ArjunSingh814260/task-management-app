(function() {
    'use strict';

    angular.module('taskManagementApp')
        .controller('NavbarController', ['AuthService', '$location', function(AuthService, $location) {
            var vm = this;

            vm.isAuthenticated = function() {
                return AuthService.isAuthenticated();
            };

            vm.getCurrentUser = function() {
                return AuthService.getCurrentUser();
            };

            vm.logout = function() {
                AuthService.logout();
                $location.path('/login');
            };
        }]);
})();
