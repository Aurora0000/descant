var newTopicApp = angular.module('descant.directives.newtopic', ['descant.config', 'descant.services.tokenservice',
																 'descant.services.templateservice']);

newTopicApp.directive('newTopicBox', function(templateService) {
	return {
		restrict: 'E',
		templateUrl: function() {
			return 'templates/' + templateService.currentTemplateSet() + '/topics/new-topic-box.html';	
		},
		controller: function(tokenService, tagService, $rootScope, $location, $http, descantConfig) {
			this.auth = tokenService.authenticated;
			this.submitting = false;
			
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
			this.addTopic = function(title, contents, tag_ids) {
				this.submitting = true;
				var i;
				for (i = 0; i < tag_ids.length; i++) {
					tag_ids[i] = parseInt(tag_ids[i]['id']);
				}
				var ntb = this;
				$http.post(descantConfig.backend + "/api/v0.1/topics/", {"title": title, "contents": contents, "tag_ids": tag_ids}).success(function(data){
					ntb.submitting = false;
					$location.path('/topics');
					ntb.toggleNTP();
					$rootScope.$broadcast('topics:refresh');
				})
				.error(function(data) {
					ntb.submitting = false;
					alert("Error!");
				});
			};
			
			this.loadTags = function() {
				return tagService.getAllTags().$promise;
			};
		},
		controllerAs: 'newTopicCtrl'
	};
});
