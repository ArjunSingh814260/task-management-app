(function() {
    'use strict';

    angular.module('taskManagementApp')
        .directive('taskCard', function() {
            return {
                restrict: 'E',
                scope: {
                    task: '=',
                    onEdit: '&',
                    onComplete: '&',
                    canEdit: '&'
                },
                templateUrl: 'app/directives/task-card.html',
                link: function(scope, element, attrs) {
                }
            };
        });
})();
