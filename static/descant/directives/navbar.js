var navBarApp = angular.module('descant.directives.navbar', ['descant.services.templateservice']);

navBarApp.directive('navBar', function(templateService) {
  return {
    restrict: 'E',
    templateUrl: function() {
      return 'templates/' + templateService.currentTemplateSet() + '/nav/nav-bar.html';
    }
  }
});
