var newPostApp = angular.module('descant.directives.newpost', ['descant.config', 'descant.services.tokenservice']);

newPostApp.directive('newPostBox', function($location) {
	return {
		restrict: 'E',
		templateUrl: 'templates/posts/new-post-box.html',
		controller: function(tokenService, $rootScope, $http, descantConfig) {
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
				var npb = this;
				$http.post(descantConfig.backend + "/api/v0.1/topics/" + post_id + "/replies/", {"contents": contents}).success(function(data){
					$location.path("/topic/" + post_id);
					npb.toggleNTP();
					$rootScope.$broadcast('topic:refresh');
				})
				.error(function(data) {
					alert("Error adding post.");
				});
			};
		},
		controllerAs: 'newPostCtrl'
	};
});