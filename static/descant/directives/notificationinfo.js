var notificationApp = angular.module('descant.directives.notificationinfo', ['descant.config', 'descant.filters.html', 'descant.services.templateservice']);

notificationApp.directive('notificationInfo', function(descantConfig, templateService) {
	return {
		restrict: 'E',
		templateUrl: function() {
			return 'templates/' + templateService.currentTemplateSet() + '/notifications/notification-info.html';	
		},
		scope: {
			id: '@'	
		},
		controller: function($http, $location, $scope, tokenService) {
			this.loadNotification = function() {
				var ctrl = this;
				var req = $http.post(descantConfig.backend + '/api/v0.1/notifications/' + $scope.id + '/mark-read/');
				req.success(function(data) { 
					ctrl.notification = data;
				});
				req.error(function(data) {
					alert("Error!");
				});
			};
			
			this.deleteNotification = function() {
				var req = $http.delete(descantConfig.backend + '/api/v0.1/notifications/' + $scope.id + '/');
				req.success(function(data) {
					$location.path('/notifications');
				});
				req.error(function(data) {
					alert('Error!');
				});
			};
			
			this.loadNotification();
		},
		controllerAs: 'notificationCtrl'
	}
});
