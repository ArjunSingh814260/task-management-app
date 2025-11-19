describe('TaskService', function() {
    var TaskService;
    var $httpBackend;
    var $q;
    var $rootScope;
    var $templateCache;

    beforeEach(module('taskManagementApp'));


    beforeEach(inject(function(_TaskService_, _$httpBackend_, _$q_, _$rootScope_, _$templateCache_) {
        TaskService = _TaskService_;
        $httpBackend = _$httpBackend_;
        $q = _$q_;
        $rootScope = _$rootScope_;
        $templateCache = _$templateCache_;

        $templateCache.put('app/views/login.html', '');
        $templateCache.put('app/views/task-list.html', '');
        $templateCache.put('app/views/task-form.html', '');
    }));

    afterEach(function() {
        try {
            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        } catch (e) {
        }
    });

    describe('getTasks', function() {
        it('should fetch tasks from API and map them correctly', function() {
            var mockTasks = [
                {
                    id: 1,
                    title: 'Test Task',
                    completed: false,
                    userId: 1
                }
            ];

            $httpBackend.expectGET('https://jsonplaceholder.typicode.com/todos')
                .respond(200, mockTasks);

            var result;
            TaskService.getTasks().then(function(tasks) {
                result = tasks;
            });

            $httpBackend.flush();
            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }

            expect(result).toBeDefined();
            expect(result.length).toBeGreaterThan(0);
            expect(result[0].title).toBe('Test Task');
            expect(result[0].description).toBeDefined();
            expect(result[0].dueDate).toBeDefined();
        });

        it('should handle API errors gracefully', function() {
            $httpBackend.expectGET('https://jsonplaceholder.typicode.com/todos')
                .respond(500, { error: 'Server Error' });

            var result;
            TaskService.getTasks().then(function(tasks) {
                result = tasks;
            });

            $httpBackend.flush();
            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
        });
    });

    describe('getTaskById', function() {
        it('should fetch a single task by ID', function() {
            var mockTask = {
                id: 1,
                title: 'Test Task',
                completed: false,
                userId: 1
            };

            $httpBackend.expectGET('https://jsonplaceholder.typicode.com/todos/1')
                .respond(200, mockTask);

            var result;
            TaskService.getTaskById(1).then(function(task) {
                result = task;
            });

            $httpBackend.flush();
            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }

            expect(result).toBeDefined();
            expect(result.id).toBe(1);
            expect(result.title).toBe('Test Task');
        });
    });

    describe('createTask', function() {
        it('should create a new task', function() {
            var newTask = {
                title: 'New Task',
                description: 'Task description',
                status: 'Pending',
                dueDate: new Date()
            };

            $httpBackend.expectPOST('https://jsonplaceholder.typicode.com/todos')
                .respond(201, { id: 123, title: 'New Task' });

            var result;
            TaskService.createTask(newTask).then(function(task) {
                result = task;
            });

            $httpBackend.flush();
            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }

            expect(result).toBeDefined();
            expect(result.title).toBe('New Task');
            expect(result.id).toBeDefined();
        });
    });

    describe('updateTask', function() {
        it('should update an existing task', function() {
            var updatedTask = {
                title: 'Updated Task',
                description: 'Updated description',
                status: 'In Progress',
                dueDate: new Date()
            };

            $httpBackend.expectPUT('https://jsonplaceholder.typicode.com/todos/1')
                .respond(200, { id: 1, title: 'Updated Task' });

            var result;
            TaskService.updateTask(1, updatedTask).then(function(task) {
                result = task;
            });

            $httpBackend.flush();
            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }

            expect(result).toBeDefined();
            expect(result.id).toBe(1);
        });
    });

    describe('markAsCompleted', function() {
        it('should mark a task as completed', function() {
            var mockTask = {
                id: 1,
                title: 'Test Task',
                status: 'Pending',
                completed: false
            };

            $httpBackend.expectGET('https://jsonplaceholder.typicode.com/todos/1')
                .respond(200, mockTask);

            $httpBackend.expectPUT('https://jsonplaceholder.typicode.com/todos/1')
                .respond(200, { id: 1, status: 'Completed', completed: true });

            var result;
            TaskService.markAsCompleted(1).then(function(task) {
                result = task;
            });

            $httpBackend.flush();
            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }

            expect(result).toBeDefined();
            expect(result.status).toBe('Completed');
            expect(result.completed).toBe(true);
        });
    });
});

