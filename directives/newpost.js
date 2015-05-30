var newPostApp = angular.module('descant.directives.newpost', ['descant.config', 'descant.services.tokenservice']);

newPostApp.directive('newPostBox', function($location) {
	return {
		restrict: 'E',
		templateUrl: 'templates/posts/new-post-box.html',
		controller: function(tokenService, $rootScope, $http, descantConfig) {
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
			this.addReply = function(contents, post_id) {
				this.submitting = true;
				var npb = this;
				$http.post(descantConfig.backend + "/api/v0.1/topics/" + post_id + "/replies/", {"contents": contents}).success(function(data){
					npb.submitting = false;
					$location.path("/topic/" + post_id);
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