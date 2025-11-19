(function() {
    'use strict';

    angular.module('taskManagementApp')
        .controller('TaskListController', ['TaskService', '$location', function(TaskService, $location) {
            var vm = this;
            vm.tasks = [];
            vm.filteredTasks = [];
            vm.loading = true;
            vm.error = '';

            vm.searchQuery = '';
            vm.statusFilter = 'All';
            vm.sortBy = 'dueDate';
            vm.sortReverse = false;

            vm.statuses = ['All', 'Pending', 'In Progress', 'Completed'];

            vm.draggedTask = null;
            vm.dragOverIndex = null;

            vm.init = function() {
                vm.loadTasks();
            };

            vm.loadTasks = function() {
                vm.loading = true;
                vm.error = '';

                TaskService.getTasks()
                    .then(function(tasks) {
                        vm.tasks = vm.loadTaskOrder(tasks);
                        vm.applyFilters();
                        vm.loading = false;
                    })
                    .catch(function(error) {
                        vm.error = 'Failed to load tasks. Please try again.';
                        vm.loading = false;
                    });
            };

            vm.applyFilters = function() {
                var filtered = vm.tasks;

                if (vm.statusFilter && vm.statusFilter !== 'All') {
                    filtered = filtered.filter(function(task) {
                        return task.status === vm.statusFilter;
                    });
                }

                if (vm.searchQuery) {
                    var query = vm.searchQuery.toLowerCase();
                    filtered = filtered.filter(function(task) {
                        return task.title.toLowerCase().indexOf(query) !== -1;
                    });
                }

                filtered.sort(function(a, b) {
                    var aVal = a[vm.sortBy];
                    var bVal = b[vm.sortBy];

                    if (vm.sortBy === 'dueDate') {
                        aVal = new Date(aVal).getTime();
                        bVal = new Date(bVal).getTime();
                    } else {
                        aVal = (aVal || '').toString().toLowerCase();
                        bVal = (bVal || '').toString().toLowerCase();
                    }

                    if (aVal < bVal) {
                        return vm.sortReverse ? 1 : -1;
                    }
                    if (aVal > bVal) {
                        return vm.sortReverse ? -1 : 1;
                    }
                    return 0;
                });

                vm.filteredTasks = filtered;
            };

            vm.toggleSort = function(field) {
                if (vm.sortBy === field) {
                    vm.sortReverse = !vm.sortReverse;
                } else {
                    vm.sortBy = field;
                    vm.sortReverse = false;
                }
                vm.applyFilters();
            };

            vm.addTask = function() {
                $location.path('/tasks/add');
            };

            vm.editTask = function(taskId) {
                $location.path('/tasks/edit/' + taskId);
            };

            vm.markAsCompleted = function(taskId) {
                TaskService.markAsCompleted(taskId)
                    .then(function() {
                        vm.loadTasks();
                    })
                    .catch(function(error) {
                        vm.error = 'Failed to update task. Please try again.';
                    });
            };

            vm.canEdit = function(task) {
                return task.status !== 'Completed';
            };

            vm.isDragDisabled = function() {
                return vm.statusFilter !== 'All' || 
                       vm.searchQuery !== '' || 
                       vm.sortBy !== 'dueDate' || 
                       vm.sortReverse !== false;
            };

            vm.onDragStart = function(event, task, index) {
                if (vm.isDragDisabled()) {
                    event.preventDefault();
                    return false;
                }

                var target = event.target;
                var isInteractive = false;
                while (target && !target.classList.contains('task-card')) {
                    var tagName = target.tagName;
                    if (tagName === 'BUTTON' || tagName === 'A' || tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') {
                        isInteractive = true;
                        break;
                    }
                    target = target.parentElement;
                }
                if (isInteractive) {
                    event.preventDefault();
                    return false;
                }

                vm.draggedTask = task;
                vm.draggedIndex = index;
                
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('text/plain', task.id.toString());
                
                target = event.target;
                while (target && !target.classList.contains('task-card')) {
                    target = target.parentElement;
                }
                if (target) {
                    target.style.opacity = '0.5';
                    target.classList.add('dragging');
                }
            };

            vm.onDragOver = function(event, index) {
                if (vm.isDragDisabled() || !vm.draggedTask) {
                    return;
                }

                event.preventDefault();
                event.stopPropagation();
                event.dataTransfer.dropEffect = 'move';
                
                if (vm.dragOverIndex !== index) {
                    vm.dragOverIndex = index;
                }
            };

            vm.onDragLeave = function(event) {
                vm.dragOverIndex = null;
            };

            vm.onDrop = function(event, dropIndex) {
                event.preventDefault();
                event.stopPropagation();

                if (!vm.draggedTask || vm.draggedIndex === null || vm.isDragDisabled()) {
                    vm.resetDragState();
                    return;
                }

                if (vm.draggedIndex !== dropIndex) {
                    var newOrder = [];
                    
                    for (var i = 0; i < vm.filteredTasks.length; i++) {
                        newOrder.push(vm.filteredTasks[i]);
                    }
                    
                    var draggedItem = newOrder[vm.draggedIndex];
                    
                    newOrder.splice(vm.draggedIndex, 1);
                    
                    var insertIndex;
                    
                    if (vm.draggedIndex < dropIndex) {
                        insertIndex = dropIndex - 1;
                    } else {
                        insertIndex = dropIndex;
                    }
                    
                    if (insertIndex < 0) {
                        insertIndex = 0;
                    } else if (insertIndex > newOrder.length) {
                        insertIndex = newOrder.length;
                    }
                    
                    newOrder.splice(insertIndex, 0, draggedItem);
                    
                    vm.filteredTasks = newOrder;

                    vm.updateTaskOrder();
                }

                vm.resetDragState();
            };

            vm.resetDragState = function() {
                var draggingElements = document.querySelectorAll('.task-card.dragging, .task-card.drag-over');
                for (var i = 0; i < draggingElements.length; i++) {
                    draggingElements[i].style.opacity = '';
                    draggingElements[i].style.transform = '';
                    draggingElements[i].classList.remove('dragging', 'drag-over');
                }

                vm.draggedTask = null;
                vm.draggedIndex = null;
                vm.dragOverIndex = null;
            };

            vm.onDragEnd = function(event) {
                vm.resetDragState();
            };

            vm.updateTaskOrder = function() {
                var orderMap = {};
                vm.filteredTasks.forEach(function(task, index) {
                    orderMap[task.id] = index;
                });

                var orderedTasks = [];
                var unorderedTasks = [];

                vm.tasks.forEach(function(task) {
                    if (orderMap.hasOwnProperty(task.id)) {
                        orderedTasks.push({ task: task, order: orderMap[task.id] });
                    } else {
                        unorderedTasks.push(task);
                    }
                });

                orderedTasks.sort(function(a, b) {
                    return a.order - b.order;
                });

                vm.tasks = orderedTasks.map(function(item) {
                    return item.task;
                }).concat(unorderedTasks);

                vm.saveTaskOrder();
            };

            vm.saveTaskOrder = function() {
                var order = vm.tasks.map(function(task) {
                    return task.id;
                });
                try {
                    localStorage.setItem('task_order', JSON.stringify(order));
                } catch (e) {
                    console.warn('Could not save task order:', e);
                }
            };

            vm.loadTaskOrder = function(tasks) {
                try {
                    var savedOrder = localStorage.getItem('task_order');
                    if (savedOrder) {
                        var order = JSON.parse(savedOrder);
                        var taskMap = {};
                        var orderedTasks = [];
                        var unorderedTasks = [];

                        tasks.forEach(function(task) {
                            taskMap[task.id] = task;
                        });

                        order.forEach(function(taskId) {
                            if (taskMap[taskId]) {
                                orderedTasks.push(taskMap[taskId]);
                                delete taskMap[taskId];
                            }
                        });

                        Object.keys(taskMap).forEach(function(taskId) {
                            unorderedTasks.push(taskMap[taskId]);
                        });

                        return orderedTasks.concat(unorderedTasks);
                    }
                } catch (e) {
                    console.warn('Could not load task order:', e);
                }
                return tasks;
            };

            vm.init();
        }]);
})();
