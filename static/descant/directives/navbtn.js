var navApp = angular.module('descant.directives.navbtn', ['descant.services.templateservice']);

navApp.directive('navBtn', function(templateService) {
  return {
    restrict: 'AE',
    require: '^routeUrl',
    scope: {
      routeUrl: '@',
			routeName: '@',
			routeIcon: '@'
    },
    templateUrl: function() {
      return 'templates/' + templateService.currentTemplateSet() + '/nav/nav-btn.html';
    },
		controller: function($scope, $location) {
		    this.isActive = function(route) {
		        return route == $location.path();
		    };
		},
		controllerAs: 'navCtrl'
  }
});
