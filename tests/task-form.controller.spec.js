describe('TaskFormController', function() {
    var $controller;
    var TaskService;
    var $routeParams;
    var $location;
    var $rootScope;
    var $q;
    var $templateCache;

    beforeEach(module('taskManagementApp'));

    beforeEach(inject(function(_$controller_, _TaskService_, _$routeParams_, _$location_, _$rootScope_, _$q_, _$templateCache_) {
        $controller = _$controller_;
        TaskService = _TaskService_;
        $routeParams = _$routeParams_;
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
        it('should initialize in add mode when no ID provided', function() {
            $routeParams.id = undefined;

            var controller = $controller('TaskFormController');

            expect(controller.isEditMode).toBe(false);
            expect(controller.task.title).toBe('');
            expect(controller.task.status).toBe('Pending');
        });

        it('should initialize in edit mode when ID provided', function() {
            var deferred = $q.defer();
            $routeParams.id = 1;
            spyOn(TaskService, 'getTaskById').and.returnValue(deferred.promise);

            var controller = $controller('TaskFormController');

            expect(controller.isEditMode).toBe(true);
            expect(controller.loading).toBe(true);
            expect(TaskService.getTaskById).toHaveBeenCalledWith(1);
        });
    });

    describe('loadTask', function() {
        it('should load task for editing', function() {
            var deferred = $q.defer();
            $routeParams.id = 1;
            spyOn(TaskService, 'getTaskById').and.returnValue(deferred.promise);

            var controller = $controller('TaskFormController');

            var mockTask = {
                id: 1,
                title: 'Test Task',
                description: 'Test Description',
                status: 'Pending',
                dueDate: new Date('2024-01-01')
            };

            deferred.resolve(mockTask);
            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }

            expect(controller.task.id).toBe(1);
            expect(controller.task.title).toBe('Test Task');
            expect(controller.loading).toBe(false);
        });

        it('should show error if task is completed', function() {
            var deferred = $q.defer();
            $routeParams.id = 1;
            spyOn(TaskService, 'getTaskById').and.returnValue(deferred.promise);

            var controller = $controller('TaskFormController');

            var mockTask = {
                id: 1,
                title: 'Test Task',
                status: 'Completed'
            };

            deferred.resolve(mockTask);
            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }

            expect(controller.error).toBe('Completed tasks cannot be edited');
            expect(controller.loading).toBe(false);
        });
    });

    describe('validate', function() {
        it('should return true for valid task', function() {
            var controller = $controller('TaskFormController');
            controller.task = {
                title: 'Test Task',
                description: 'Test Description',
                status: 'Pending',
                dueDate: new Date()
            };

            expect(controller.validate()).toBe(true);
            expect(Object.keys(controller.errors).length).toBe(0);
        });

        it('should return false and set errors for invalid task', function() {
            var controller = $controller('TaskFormController');
            controller.task = {
                title: '',
                description: '',
                status: '',
                dueDate: null
            };

            expect(controller.validate()).toBe(false);
            expect(controller.errors.title).toBeDefined();
            expect(controller.errors.description).toBeDefined();
            expect(controller.errors.status).toBeDefined();
            expect(controller.errors.dueDate).toBeDefined();
        });
    });

    describe('save', function() {
        it('should create new task in add mode', function() {
            var deferred = $q.defer();
            $routeParams.id = undefined;
            spyOn(TaskService, 'createTask').and.returnValue(deferred.promise);

            var controller = $controller('TaskFormController');
            controller.task = {
                title: 'New Task',
                description: 'Description',
                status: 'Pending',
                dueDate: new Date()
            };

            controller.save();

            expect(controller.loading).toBe(true);
            expect(TaskService.createTask).toHaveBeenCalled();

            deferred.resolve({ id: 1, title: 'New Task' });
            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }

            expect(controller.loading).toBe(false);
            expect($location.path).toHaveBeenCalledWith('/tasks');
        });

        it('should update task in edit mode', function() {
            var deferred = $q.defer();
            $routeParams.id = 1;
            spyOn(TaskService, 'getTaskById').and.returnValue($q.when({
                id: 1,
                title: 'Task',
                status: 'Pending'
            }));
            spyOn(TaskService, 'updateTask').and.returnValue(deferred.promise);

            var controller = $controller('TaskFormController');
            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }

            controller.task = {
                id: 1,
                title: 'Updated Task',
                description: 'Description',
                status: 'In Progress',
                dueDate: new Date()
            };

            controller.save();

            expect(TaskService.updateTask).toHaveBeenCalledWith(1, controller.task);

            deferred.resolve({ id: 1, title: 'Updated Task' });
            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }

            expect($location.path).toHaveBeenCalledWith('/tasks');
        });

        it('should not save if validation fails', function() {
            var controller = $controller('TaskFormController');
            controller.task = {
                title: '',
                description: '',
                status: '',
                dueDate: null
            };

            controller.save();

            expect(controller.loading).toBe(false);
            expect(Object.keys(controller.errors).length).toBeGreaterThan(0);
        });
    });
});

