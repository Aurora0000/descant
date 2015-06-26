var rulesApp = angular.module('descant.directives.rules', ['descant.config', 'descant.services.templateservice']);

pmApp.directive('rules', function(templateService) {
	return {
		restrict: 'AE',
		templateUrl: function() {
			return 'templates/' + templateService.currentTemplateSet() + '/users/rules.html';	
		},
		controller: function($http, descantConfig) {
			var ctrl = this;
			$http.get(descantConfig.backend + '/api/v0.1/rules/').success(function(data) {
				ctrl.rules = data;
			});

		},
		controllerAs: 'rulesCtrl'
	};
});