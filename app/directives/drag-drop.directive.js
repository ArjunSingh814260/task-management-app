(function() {
    'use strict';

    function safeApply(scope, fn) {
        if (scope.$$phase || scope.$root.$$phase) {
            fn();
        } else {
            scope.$apply(fn);
        }
    }

    angular.module('taskManagementApp')
        .directive('ngDragstart', function() {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    element.on('dragstart', function(event) {
                        safeApply(scope, function() {
                            scope.$eval(attrs.ngDragstart, { $event: event });
                        });
                    });
                }
            };
        })
        .directive('ngDragover', function() {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    element.on('dragover', function(event) {
                        event.preventDefault();
                        event.stopPropagation();
                        safeApply(scope, function() {
                            scope.$eval(attrs.ngDragover, { $event: event });
                        });
                    });
                }
            };
        })
        .directive('ngDragleave', function() {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    element.on('dragleave', function(event) {
                        safeApply(scope, function() {
                            scope.$eval(attrs.ngDragleave, { $event: event });
                        });
                    });
                }
            };
        })
        .directive('ngDrop', function() {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    element.on('drop', function(event) {
                        event.preventDefault();
                        event.stopPropagation();
                        safeApply(scope, function() {
                            scope.$eval(attrs.ngDrop, { $event: event });
                        });
                    });
                }
            };
        })
        .directive('ngDragend', function() {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    element.on('dragend', function(event) {
                        safeApply(scope, function() {
                            scope.$eval(attrs.ngDragend, { $event: event });
                        });
                    });
                }
            };
        });
})();
