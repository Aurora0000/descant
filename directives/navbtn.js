var navApp = angular.module('descant.directives.navbtn', []);

navApp.directive('navBtn', function() {
  return {
    restrict: 'E',
    require: '^routeUrl',
    scope: {
      routeUrl: '@',
			routeName: '@',
			routeIcon: '@'
    },
    templateUrl: 'templates/nav/nav-btn.html',
		controller: function($scope, $location) {
		    $scope.isActive = function(route) {
		        return route === $location.path();
		    }
		},
		controllerAs: 'navCtrl'
  }
});
