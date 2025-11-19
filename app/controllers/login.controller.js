(function() {
    'use strict';

    angular.module('taskManagementApp')
        .controller('LoginController', ['AuthService', '$location', function(AuthService, $location) {
            var vm = this;
            vm.credentials = {
                username: '',
                password: ''
            };
            vm.error = '';
            vm.loading = false;

            if (AuthService.isAuthenticated()) {
                $location.path('/tasks');
            }

            vm.login = function() {
                vm.error = '';
                vm.loading = true;

                if (!vm.credentials.username || !vm.credentials.password) {
                    vm.error = 'Please enter both username and password';
                    vm.loading = false;
                    return;
                }

                AuthService.login(vm.credentials)
                    .then(function(response) {
                        vm.loading = false;
                        $location.path('/tasks');
                    })
                    .catch(function(error) {
                        vm.loading = false;
                        vm.error = error.message || 'Login failed. Please try again.';
                    });
            };
        }]);
})();
