describe('LoginController', function() {
    var $controller;
    var $location;
    var AuthService;
    var $rootScope;
    var $q;
    var $templateCache;

    beforeEach(module('taskManagementApp'));

    beforeEach(inject(function(_$controller_, _$location_, _AuthService_, _$rootScope_, _$q_, _$templateCache_) {
        $controller = _$controller_;
        $location = _$location_;
        AuthService = _AuthService_;
        $rootScope = _$rootScope_;
        $q = _$q_;
        $templateCache = _$templateCache_;

        $templateCache.put('app/views/login.html', '');
        $templateCache.put('app/views/task-list.html', '');
        $templateCache.put('app/views/task-form.html', '');

        spyOn($location, 'path');
    }));

    describe('initialization', function() {
        it('should initialize with empty credentials', function() {
            spyOn(AuthService, 'isAuthenticated').and.returnValue(false);

            var controller = $controller('LoginController');

            expect(controller.credentials.username).toBe('');
            expect(controller.credentials.password).toBe('');
            expect(controller.error).toBe('');
            expect(controller.loading).toBe(false);
        });

        it('should redirect to tasks if already authenticated', function() {
            spyOn(AuthService, 'isAuthenticated').and.returnValue(true);

            $controller('LoginController');

            expect($location.path).toHaveBeenCalledWith('/tasks');
        });
    });

    describe('login', function() {
        it('should show error if credentials are missing', function() {
            var controller = $controller('LoginController');
            controller.credentials = { username: '', password: '' };

            controller.login();

            expect(controller.error).toBe('Please enter both username and password');
            expect(controller.loading).toBe(false);
        });

        it('should call AuthService.login with credentials', function(done) {
            var deferred = $q.defer();
            spyOn(AuthService, 'login').and.returnValue(deferred.promise);

            var controller = $controller('LoginController');
            controller.credentials = {
                username: 'testuser',
                password: 'testpass'
            };

            controller.login();

            expect(controller.loading).toBe(true);
            expect(AuthService.login).toHaveBeenCalledWith(controller.credentials);

            deferred.resolve({ token: 'mock-token', user: 'testuser' });
            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }

            setTimeout(function() {
                if (!$rootScope.$$phase) {
                    $rootScope.$apply();
                }
                expect(controller.loading).toBe(false);
                expect($location.path).toHaveBeenCalledWith('/tasks');
                done();
            }, 600);
        });

        it('should handle login errors', function(done) {
            var deferred = $q.defer();
            spyOn(AuthService, 'login').and.returnValue(deferred.promise);

            var controller = $controller('LoginController');
            controller.credentials = {
                username: 'testuser',
                password: 'testpass'
            };

            controller.login();

            deferred.reject({ message: 'Invalid credentials' });
            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }

            setTimeout(function() {
                if (!$rootScope.$$phase) {
                    $rootScope.$apply();
                }
                expect(controller.loading).toBe(false);
                expect(controller.error).toBe('Invalid credentials');
                done();
            }, 600);
        });
    });
});

