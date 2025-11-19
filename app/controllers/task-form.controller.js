(function() {
    'use strict';

    angular.module('taskManagementApp')
        .controller('TaskFormController', ['TaskService', '$routeParams', '$location', function(TaskService, $routeParams, $location) {
            var vm = this;

            function formatDateForInput(date) {
                if (!date) return '';
                var d = new Date(date);
                var year = d.getFullYear();
                var month = d.getMonth() + 1;
                var day = d.getDate();
                month = month < 10 ? '0' + month : month;
                day = day < 10 ? '0' + day : day;
                return year + '-' + month + '-' + day;
            }

            function parseDateFromInput(dateString) {
                if (!dateString) return null;
                return new Date(dateString);
            }

            vm.task = {
                title: '',
                description: '',
                status: 'Pending',
                dueDate: formatDateForInput(new Date())
            };
            vm.isEditMode = false;
            vm.loading = false;
            vm.error = '';
            vm.errors = {};

            vm.statuses = ['Pending', 'In Progress', 'Completed'];

            vm.init = function() {
                var taskId = $routeParams.id;

                if (taskId) {
                    vm.isEditMode = true;
                    vm.loadTask(taskId);
                }
            };

            vm.loadTask = function(taskId) {
                vm.loading = true;
                vm.error = '';

                TaskService.getTaskById(taskId)
                    .then(function(task) {
                        if (task.status === 'Completed') {
                            vm.error = 'Completed tasks cannot be edited';
                            vm.loading = false;
                            return;
                        }

                        vm.task = {
                            id: task.id,
                            title: task.title,
                            description: task.description,
                            status: task.status,
                            dueDate: formatDateForInput(new Date(task.dueDate))
                        };
                        vm.loading = false;
                    })
                    .catch(function(error) {
                        vm.error = 'Failed to load task. Please try again.';
                        vm.loading = false;
                    });
            };

            vm.validate = function() {
                vm.errors = {};

                if (!vm.task.title || vm.task.title.trim() === '') {
                    vm.errors.title = 'Title is required';
                }

                if (!vm.task.description || vm.task.description.trim() === '') {
                    vm.errors.description = 'Description is required';
                }

                if (!vm.task.dueDate) {
                    vm.errors.dueDate = 'Due date is required';
                }

                if (!vm.task.status) {
                    vm.errors.status = 'Status is required';
                }

                return Object.keys(vm.errors).length === 0;
            };

            vm.save = function() {
                vm.error = '';
                vm.errors = {};

                if (!vm.validate()) {
                    return;
                }

                vm.loading = true;

                var taskData = angular.copy(vm.task);
                taskData.dueDate = parseDateFromInput(taskData.dueDate);

                var savePromise = vm.isEditMode
                    ? TaskService.updateTask(vm.task.id, taskData)
                    : TaskService.createTask(taskData);

                savePromise
                    .then(function(savedTask) {
                        vm.loading = false;
                        $location.path('/tasks');
                    })
                    .catch(function(error) {
                        vm.loading = false;
                        vm.error = 'Failed to save task. Please try again.';
                    });
            };

            vm.cancel = function() {
                $location.path('/tasks');
            };

            vm.init();
        }]);
})();
