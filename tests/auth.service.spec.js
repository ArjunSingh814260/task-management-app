describe('AuthService', function() {
    var AuthService;
    var $window;
    var $q;
    var $rootScope;
    var $templateCache;

    beforeEach(module('taskManagementApp'));

    beforeEach(inject(function(_AuthService_, _$window_, _$q_, _$rootScope_, _$templateCache_) {
        AuthService = _AuthService_;
        $window = _$window_;
        $q = _$q_;
        $rootScope = _$rootScope_;
        $templateCache = _$templateCache_;

        $templateCache.put('app/views/login.html', '');
        $templateCache.put('app/views/task-list.html', '');
        $templateCache.put('app/views/task-form.html', '');

        $window.localStorage.clear();
    }));

    describe('login', function() {
        it('should login successfully with valid credentials', function(done) {
            var credentials = {
                username: 'testuser',
                password: 'testpass'
            };

            AuthService.login(credentials).then(function(response) {
                expect(response.token).toBeDefined();
                expect(response.user).toBe('testuser');
                expect($window.localStorage.getItem('task_management_token')).toBeDefined();
                expect($window.localStorage.getItem('task_management_user')).toBe('testuser');
                done();
            });

            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }
            setTimeout(function() {
                if (!$rootScope.$$phase) {
                    $rootScope.$apply();
                }
            }, 600);
        });

        it('should reject login with missing credentials', function(done) {
            var credentials = {
                username: '',
                password: ''
            };

            AuthService.login(credentials).catch(function(error) {
                expect(error.message).toBeDefined();
                done();
            });

            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }
            setTimeout(function() {
                if (!$rootScope.$$phase) {
                    $rootScope.$apply();
                }
            }, 600);
        });
    });

    describe('logout', function() {
        it('should clear token and user from localStorage', function() {
            $window.localStorage.setItem('task_management_token', 'test-token');
            $window.localStorage.setItem('task_management_user', 'testuser');

            AuthService.logout();

            expect($window.localStorage.getItem('task_management_token')).toBeNull();
            expect($window.localStorage.getItem('task_management_user')).toBeNull();
        });
    });

    describe('isAuthenticated', function() {
        it('should return false when no token exists', function() {
            expect(AuthService.isAuthenticated()).toBe(false);
        });

        it('should return true when valid token exists', function() {
            var mockToken = btoa(JSON.stringify({
                username: 'testuser',
                exp: Date.now() + (24 * 60 * 60 * 1000)
            }));

            $window.localStorage.setItem('task_management_token', mockToken);
            $window.localStorage.setItem('task_management_user', 'testuser');

            expect(AuthService.isAuthenticated()).toBe(true);
        });

        it('should return false when token is expired', function() {
            var expiredToken = btoa(JSON.stringify({
                username: 'testuser',
                exp: Date.now() - 1000
            }));

            $window.localStorage.setItem('task_management_token', expiredToken);
            $window.localStorage.setItem('task_management_user', 'testuser');

            expect(AuthService.isAuthenticated()).toBe(false);
            expect($window.localStorage.getItem('task_management_token')).toBeNull();
        });
    });

    describe('getCurrentUser', function() {
        it('should return current user from localStorage', function() {
            $window.localStorage.setItem('task_management_user', 'testuser');
            expect(AuthService.getCurrentUser()).toBe('testuser');
        });

        it('should return null when no user exists', function() {
            expect(AuthService.getCurrentUser()).toBeNull();
        });
    });

    describe('requireAuth', function() {
        it('should resolve when user is authenticated', function(done) {
            var mockToken = btoa(JSON.stringify({
                username: 'testuser',
                exp: Date.now() + (24 * 60 * 60 * 1000)
            }));

            $window.localStorage.setItem('task_management_token', mockToken);
            $window.localStorage.setItem('task_management_user', 'testuser');

            AuthService.requireAuth().then(function() {
                expect(true).toBe(true);
                done();
            });

            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }
        });

        it('should reject when user is not authenticated', function(done) {
            AuthService.requireAuth().catch(function(error) {
                expect(error).toBe('AUTH_REQUIRED');
                done();
            });

            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }
        });
    });
});

