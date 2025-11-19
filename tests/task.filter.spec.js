describe('Task Filters', function() {
    var $filter;

    beforeEach(module('taskManagementApp'));

    beforeEach(inject(function(_$filter_, _$templateCache_) {
        $filter = _$filter_;
        var $templateCache = _$templateCache_;
        $templateCache.put('app/views/login.html', '');
        $templateCache.put('app/views/task-list.html', '');
        $templateCache.put('app/views/task-form.html', '');
    }));

    describe('formatDate', function() {
        it('should format date correctly', function() {
            var formatDate = $filter('formatDate');
            var date = new Date('2024-01-15');

            var result = formatDate(date);

            expect(result).toMatch(/\d+\/\d+\/\d+/);
        });

        it('should return empty string for null date', function() {
            var formatDate = $filter('formatDate');

            var result = formatDate(null);

            expect(result).toBe('');
        });

        it('should return empty string for undefined date', function() {
            var formatDate = $filter('formatDate');

            var result = formatDate(undefined);

            expect(result).toBe('');
        });
    });

    describe('statusClass', function() {
        it('should return correct class for Pending status', function() {
            var statusClass = $filter('statusClass');

            var result = statusClass('Pending');

            expect(result).toBe('status-pending');
        });

        it('should return correct class for In Progress status', function() {
            var statusClass = $filter('statusClass');

            var result = statusClass('In Progress');

            expect(result).toBe('status-in-progress');
        });

        it('should return correct class for Completed status', function() {
            var statusClass = $filter('statusClass');

            var result = statusClass('Completed');

            expect(result).toBe('status-completed');
        });

        it('should return empty string for unknown status', function() {
            var statusClass = $filter('statusClass');

            var result = statusClass('Unknown');

            expect(result).toBe('');
        });
    });
});

