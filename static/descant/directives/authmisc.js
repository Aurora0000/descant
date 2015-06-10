var authMiscApp = angular.module('descant.directives.authmisc', ['descant.services.tokenservice']);

authMiscApp.directive('logout', function(tokenService, $location) {
	return {
		restrict: 'E',
		controller: function($location) {
			tokenService.logout().then(function(data){
				$location.path('/');
			}, function(data){
				alert("Cannot log out.");
				tokenService.purgeToken();
			});
		}
	}
});

authMiscApp.directive('emitToken', function(tokenService) {
	return {
		restrict: 'E',
		template: '',
		controller: function() {
			tokenService.setHeader();
		}
	}
});