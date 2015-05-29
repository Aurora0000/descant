var topicViewApp = angular.module('descant.directives.topicview', ['descant.config']);

topicViewApp.directive('topicFirstpost', function(descantConfig) {
	return {
		restrict: 'E',
		templateUrl: 'templates/topics/topic-firstpost.html',
		controller: function($http, $scope) {
			var topicCtrl = this;
			topicCtrl.loaded = false;
			var req = $http.get(descantConfig.backend + "/api/v0.1/topics/" + $scope.topicId + "/");
			req.success(function (data) {
				topicCtrl.post = data;
				topicCtrl.loaded = true;
				document.title = topicCtrl.post.title + " | " + descantConfig.forumName;
			});
			req.error(function(data) {
				topicCtrl.loaded = true;
				topicCtrl.error = true;
			});
		},
		controllerAs: 'topic'
	}
});
topicViewApp.directive('postList', function(descantConfig) {
	return {
		restrict: 'E',
		templateUrl: 'templates/posts/reply-list.html',
		controller: function($http, $interval, $rootScope, $scope) {
			var postsCtrl = this;
			this.list = [];
			this.busy = false;
			this.offset = 0;
			this.limit = 15;
			this.end = false;
			
			this.updateList = function() {
				if (postsCtrl.busy || postsCtrl.end) {
					return;
				}
				postsCtrl.busy = true;
				var req = $http.get(descantConfig.backend + "/api/v0.1/topics/" + $scope.topicId + "/replies/?limit=" + postsCtrl.limit.toString() + "&offset=" + postsCtrl.offset.toString());
				req.success(function (data) {
					if (data['results'].length == 0){
						postsCtrl.end = true;
						return;
					}
					var items = data['results'];
      				for (var i = 0; i < items.length; i++) {
        				postsCtrl.list.push(items[i]);
      				}
					postsCtrl.offset += data['results'].length;
					postsCtrl.busy = false;
				});
				req.error(function(data) {
					postsCtrl.busy = false;
					postsCtrl.end = true;
				});
			};
			
			this.refreshList = function() {
				postsCtrl.busy = true;
				postsCtrl.end = false;
				var req = $http.get(descantConfig.backend + "/api/v0.1/topics/" + $scope.topicId + "/replies/?limit=" + postsCtrl.offset.toString() + "&offset=0");
				req.success(function (data) {
					if (data['results'].length == 0){
						postsCtrl.end = true;
						return;
					}
					var items = data['results'];
      				postsCtrl.list = items;
					postsCtrl.busy = false;
				});
				req.error(function(data) {
					postsCtrl.busy = false;
					postsCtrl.end = true;
				});
			};
			
			// Update once every 45 seconds.
			this.stopRefreshList = $interval(this.refreshList, 45000);

			$rootScope.$on('topic:refresh', function() {
				postsCtrl.refreshList();
			});

			this.destroy = function() {
				$interval.cancel(postsCtrl.stopRefreshList);	
			};
			// listen on DOM destroy (removal) event, and cancel the next UI update
			// to prevent updating time after the DOM element was removed.
			$rootScope.$on('$destroy', function() {
				postsCtrl.destroy();
			});
			$rootScope.$on('$locationChangeSuccess', function() {
				postsCtrl.destroy();
			});

		},
		controllerAs: 'posts'
	}
});
