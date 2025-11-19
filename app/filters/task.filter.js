(function() {
    'use strict';

    angular.module('taskManagementApp')
        .filter('formatDate', function() {
            return function(date) {
                if (!date) {
                    return '';
                }

                var d = new Date(date);
                var day = d.getDate();
                var month = d.getMonth() + 1;
                var year = d.getFullYear();

                return month + '/' + day + '/' + year;
            };
        })
        .filter('statusClass', function() {
            return function(status) {
                var statusMap = {
                    'Pending': 'status-pending',
                    'In Progress': 'status-in-progress',
                    'Completed': 'status-completed'
                };
                return statusMap[status] || '';
            };
        });
})();
