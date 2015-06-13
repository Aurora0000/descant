var includesApp = angular.module('descant.directives.includes', ['descant.services.templateservice']);

includesApp.directive('includes', function(templateService) {
    return {
        restrict: 'E',
        templateUrl: function() {
          return 'templates/' + templateService.currentTemplateSet() + '/settings/includes.html';  
        }
    };
});
