var newPostApp = angular.module('descant.directives.newpost', ['descant.config', 'descant.services.tokenservice',
															   'descant.services.templateservice']);

newPostApp.directive('newPostBox', function(templateService) {
	return {
		restrict: 'E',
		templateUrl: function() {
			return 'templates/' + templateService.currentTemplateSet() + '/posts/new-post-box.html';	
		},
		scope: {
			postData: '='
		},
		controller: function(tokenService, $rootScope, $location, $scope, $http, descantConfig) {
			this.submitting = false;
			this.auth = tokenService.authenticated;
			var ntb = this;
			$rootScope.$on('auth:statusChange', function() {
				ntb.auth = tokenService.authenticated;
			});
			this.showNTP = false;
			this.toggleNTP = function() {
				if (this.showNTP == true) {
					this.showNTP = false;
				} else {
					this.showNTP = true;
				}
			};
			this.addReply = function(contents) {
				this.submitting = true;
				var npb = this;
				$http.post(descantConfig.backend + "/api/v0.1/topics/" + $scope.postData.id + "/replies/", {"contents": contents}).success(function(data){
					npb.submitting = false;
					$location.path("/topic/" + $scope.postData.id);
					npb.toggleNTP();
					$rootScope.$broadcast('topic:refresh');
				})
				.error(function(data) {
					npb.submitting = false;
					alert("Error!");
				});
			};
		},
		controllerAs: 'newPostCtrl'
	};
});