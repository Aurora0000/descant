var pmApp = angular.module('descant.directives.pmsendform', ['descant.config', 'descant.services.templateservice']);

pmApp.directive('pmSendForm', function(templateService) {
	return {
		restrict: 'AE',
		templateUrl: function() {
			return 'templates/' + templateService.currentTemplateSet() + '/notifications/pm-send-form.html';	
		},
		controller: function($http, $location, descantConfig) {
			this.send = function(user, message) {
				var req = $http.post(descantConfig.backend + '/api/v0.1/notifications/send/', {'recipient': user, 'message': message});
				req.success(function(data) {
					$location.path('/notifications');
				});
				req.error(function(data) {
					alert("Error!");
				});
			};

		},
		controllerAs: 'pmFormCtrl'
	};
});