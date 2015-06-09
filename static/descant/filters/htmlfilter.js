var htmlApp = angular.module('descant.filters.html', []);

app.filter('html', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});