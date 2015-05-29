var authMiscApp = angular.module('descant.directives.authmisc', ['descant.services.tokenservice']);

authMiscApp.directive('logout', ['tokenService', '$location', function(tokenService, $location) {
	return {
		restrict: 'E',
		template: '',
		controller: function($location) {
			tokenService.logout().then(function(data){
				$location.path('/');
			}, function(data){
				alert("Cannot log out.");
				tokenService.purgeToken();
			});
		}
	}
}]);

authMiscApp.directive('emitToken', ['tokenService', function(tokenService) {
	return {
		restrict: 'E',
		template: '',
		controller: function() {
			tokenService.setHeader();
		}
	}
}]);