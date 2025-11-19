describe('TaskListController', function() {
    var $controller;
    var TaskService;
    var $location;
    var $rootScope;
    var $q;
    var $templateCache;

    beforeEach(module('taskManagementApp'));

    beforeEach(inject(function(_$controller_, _TaskService_, _$location_, _$rootScope_, _$q_, _$templateCache_) {
        $controller = _$controller_;
        TaskService = _TaskService_;
        $location = _$location_;
        $rootScope = _$rootScope_;
        $q = _$q_;
        $templateCache = _$templateCache_;

        $templateCache.put('app/views/login.html', '');
        $templateCache.put('app/views/task-list.html', '');
        $templateCache.put('app/views/task-form.html', '');

        spyOn($location, 'path');
    }));

    describe('initialization', function() {
        it('should initialize with default values', function() {
            var deferred = $q.defer();
            spyOn(TaskService, 'getTasks').and.returnValue(deferred.promise);

            var controller = $controller('TaskListController');

            expect(controller.tasks).toEqual([]);
            expect(controller.filteredTasks).toEqual([]);
            expect(controller.loading).toBe(true);
            expect(controller.searchQuery).toBe('');
            expect(controller.statusFilter).toBe('All');
            expect(controller.sortBy).toBe('dueDate');
            expect(controller.sortReverse).toBe(false);
        });

        it('should load tasks on initialization', function() {
            var deferred = $q.defer();
            spyOn(TaskService, 'getTasks').and.returnValue(deferred.promise);

            var controller = $controller('TaskListController');

            expect(TaskService.getTasks).toHaveBeenCalled();

            var mockTasks = [
                { id: 1, title: 'Task 1', status: 'Pending', dueDate: new Date() },
                { id: 2, title: 'Task 2', status: 'Completed', dueDate: new Date() }
            ];

            deferred.resolve(mockTasks);
            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }

            expect(controller.tasks).toEqual(mockTasks);
            expect(controller.loading).toBe(false);
        });
    });

    describe('applyFilters', function() {
        it('should filter tasks by status', function() {
            var controller = $controller('TaskListController');
            controller.tasks = [
                { id: 1, title: 'Task 1', status: 'Pending', dueDate: new Date() },
                { id: 2, title: 'Task 2', status: 'Completed', dueDate: new Date() }
            ];
            controller.statusFilter = 'Pending';

            controller.applyFilters();

            expect(controller.filteredTasks.length).toBe(1);
            expect(controller.filteredTasks[0].status).toBe('Pending');
        });

        it('should filter tasks by search query', function() {
            var controller = $controller('TaskListController');
            controller.tasks = [
                { id: 1, title: 'Task One', status: 'Pending', dueDate: new Date() },
                { id: 2, title: 'Task Two', status: 'Pending', dueDate: new Date() }
            ];
            controller.searchQuery = 'One';

            controller.applyFilters();

            expect(controller.filteredTasks.length).toBe(1);
            expect(controller.filteredTasks[0].title).toBe('Task One');
        });

        it('should sort tasks by due date', function() {
            var controller = $controller('TaskListController');
            var date1 = new Date('2024-01-01');
            var date2 = new Date('2024-01-02');
            controller.tasks = [
                { id: 1, title: 'Task 1', status: 'Pending', dueDate: date2 },
                { id: 2, title: 'Task 2', status: 'Pending', dueDate: date1 }
            ];
            controller.sortBy = 'dueDate';
            controller.sortReverse = false;

            controller.applyFilters();

            expect(controller.filteredTasks[0].dueDate).toEqual(date1);
            expect(controller.filteredTasks[1].dueDate).toEqual(date2);
        });
    });

    describe('toggleSort', function() {
        it('should toggle sort order for same field', function() {
            var controller = $controller('TaskListController');
            controller.sortBy = 'dueDate';
            controller.sortReverse = false;

            controller.toggleSort('dueDate');

            expect(controller.sortReverse).toBe(true);
        });

        it('should change sort field and reset reverse', function() {
            var controller = $controller('TaskListController');
            controller.sortBy = 'dueDate';
            controller.sortReverse = true;

            controller.toggleSort('title');

            expect(controller.sortBy).toBe('title');
            expect(controller.sortReverse).toBe(false);
        });
    });

    describe('markAsCompleted', function() {
        it('should mark task as completed and reload tasks', function() {
            var deferred = $q.defer();
            spyOn(TaskService, 'markAsCompleted').and.returnValue(deferred.promise);
            spyOn(TaskService, 'getTasks').and.returnValue($q.when([]));

            var controller = $controller('TaskListController');

            controller.markAsCompleted(1);

            expect(TaskService.markAsCompleted).toHaveBeenCalledWith(1);

            deferred.resolve({ id: 1, status: 'Completed' });
            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }

            expect(TaskService.getTasks).toHaveBeenCalled();
        });
    });

    describe('canEdit', function() {
        it('should return true for non-completed tasks', function() {
            var controller = $controller('TaskListController');
            var task = { id: 1, status: 'Pending' };

            expect(controller.canEdit(task)).toBe(true);
        });

        it('should return false for completed tasks', function() {
            var controller = $controller('TaskListController');
            var task = { id: 1, status: 'Completed' };

            expect(controller.canEdit(task)).toBe(false);
        });
    });
});

