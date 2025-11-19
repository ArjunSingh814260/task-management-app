(function() {
    'use strict';

    angular.module('taskManagementApp')
        .service('TaskService', ['$http', '$q', function($http, $q) {
            var API_URL = 'https://jsonplaceholder.typicode.com/todos';
            var tasks = [];

            function generateDescription(title) {
                var descriptions = [
                    'Complete this task with attention to detail',
                    'Review and finalize all requirements',
                    'Coordinate with team members for completion',
                    'Ensure all quality standards are met',
                    'Follow up on pending items'
                ];
                return descriptions[Math.floor(Math.random() * descriptions.length)];
            }

            function generateDueDate() {
                var today = new Date();
                var daysToAdd = Math.floor(Math.random() * 30) + 1;
                var dueDate = new Date(today);
                dueDate.setDate(today.getDate() + daysToAdd);
                return dueDate;
            }

            function mapTask(apiTask) {
                return {
                    id: apiTask.id,
                    title: apiTask.title,
                    description: apiTask.description || generateDescription(apiTask.title),
                    status: apiTask.completed ? 'Completed' : (apiTask.status || 'Pending'),
                    dueDate: apiTask.dueDate ? new Date(apiTask.dueDate) : generateDueDate(),
                    completed: apiTask.completed || false,
                    userId: apiTask.userId
                };
            }

            this.getTasks = function() {
                var deferred = $q.defer();

                $http.get(API_URL)
                    .then(function(response) {
                        var apiTasks = response.data.map(mapTask);
                        
                        var localTasks = tasks.filter(function(task) {
                            return !apiTasks.some(function(apiTask) {
                                return apiTask.id === task.id;
                            });
                        });

                        var allTasks = apiTasks.concat(localTasks);
                        deferred.resolve(allTasks);
                    })
                    .catch(function(error) {
                        deferred.resolve(tasks);
                    });

                return deferred.promise;
            };

            this.getTaskById = function(id) {
                var deferred = $q.defer();

                var localTask = tasks.find(function(task) {
                    return task.id === parseInt(id);
                });

                if (localTask) {
                    deferred.resolve(localTask);
                } else {
                    $http.get(API_URL + '/' + id)
                        .then(function(response) {
                            deferred.resolve(mapTask(response.data));
                        })
                        .catch(function(error) {
                            deferred.reject(error);
                        });
                }

                return deferred.promise;
            };

            this.createTask = function(taskData) {
                var deferred = $q.defer();

                var newTask = {
                    id: Date.now(),
                    title: taskData.title,
                    description: taskData.description || generateDescription(taskData.title),
                    status: taskData.status || 'Pending',
                    dueDate: taskData.dueDate ? new Date(taskData.dueDate) : generateDueDate(),
                    completed: taskData.status === 'Completed',
                    userId: 1
                };

                tasks.push(newTask);

                $http.post(API_URL, newTask)
                    .then(function(response) {
                        deferred.resolve(newTask);
                    })
                    .catch(function(error) {
                        deferred.resolve(newTask);
                    });

                return deferred.promise;
            };

            this.updateTask = function(taskId, taskData) {
                var deferred = $q.defer();

                var taskIndex = tasks.findIndex(function(task) {
                    return task.id === parseInt(taskId);
                });

                var updatedTask = angular.extend({}, taskData, {
                    id: parseInt(taskId),
                    dueDate: taskData.dueDate ? new Date(taskData.dueDate) : taskData.dueDate,
                    completed: taskData.status === 'Completed'
                });

                if (taskIndex !== -1) {
                    tasks[taskIndex] = updatedTask;
                } else {
                    tasks.push(updatedTask);
                }

                $http.put(API_URL + '/' + taskId, updatedTask)
                    .then(function(response) {
                        deferred.resolve(updatedTask);
                    })
                    .catch(function(error) {
                        deferred.resolve(updatedTask);
                    });

                return deferred.promise;
            };

            this.markAsCompleted = function(taskId) {
                var deferred = $q.defer();
                var self = this;

                self.getTaskById(taskId)
                    .then(function(task) {
                        var updatedTask = angular.extend({}, task, {
                            status: 'Completed',
                            completed: true
                        });
                        return self.updateTask(taskId, updatedTask);
                    })
                    .then(function(updatedTask) {
                        deferred.resolve(updatedTask);
                    })
                    .catch(function(error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            };
        }]);
})();
