var topicViewApp = angular.module('descant.directives.topicview', ['descant.config', 'descant.filters.html', 'descant.services.templateservice']);

topicViewApp.directive('topicFirstpost', function(descantConfig, templateService) {
	return {
		restrict: 'E',
		templateUrl: function() {
			return 'templates/' + templateService.currentTemplateSet() + '/topics/topic-firstpost.html';	
		},
		scope: {
			postData: '=',
			topicId: '='	
		},
		controller: function($http, $scope, $location, $route, tagService, tokenService) {
			this.editing = false;
			var topicCtrl = this;
			topicCtrl.loaded = false;
			var req = $http.get(descantConfig.backend + "/api/v0.1/topics/" + $scope.topicId + "/");
			req.success(function (data) {
				topicCtrl.post = data;
				$scope.postData = data;
				topicCtrl.loaded = true;
				document.title = topicCtrl.post.title + " | " + descantConfig.forumName;
				if (tokenService.user != null) {
					$scope.user = tokenService.user.data.id;
				}
				else {
					$scope.user = -1;
				}
			});
			req.error(function(data) {
				topicCtrl.loaded = true;
				topicCtrl.error = true;
			});
			
			this.lock = function() {
				$http.put(descantConfig.backend + "/api/v0.1/topics/" + $scope.topicId + "/", {"title": topicCtrl.post.title, "contents": topicCtrl.post.contents, "tag_ids": topicCtrl.post.tag_ids, "is_locked": true}).success(function() {
					$route.reload();
				});
			};
			
			this.unlock = function() {
				$http.put(descantConfig.backend + "/api/v0.1/topics/" + $scope.topicId + "/", {"title": topicCtrl.post.title, "contents": topicCtrl.post.contents, "tag_ids": topicCtrl.post.tag_ids, "is_locked": false}).success(function() {
					$route.reload();
				});
			};
			
			this.edit = function() {
				this.editing = !this.editing;
				$scope.tag_ids_edited = [];
				$scope.contents_edited = topicCtrl.post.contents;
				$scope.title_edited = topicCtrl.post.title;
				for (var i = 0; i < topicCtrl.post.tag_ids.length; i++) {
					tagService.getTagInfo(topicCtrl.post.tag_ids[i]).then(function(data) {
						if (data != null) { 
							$scope.tag_ids_edited.push(data);
						}	
					});
				}
			};
			
			this.editSubmit = function() {
				var tag_ids = $scope.tag_ids_edited	;
				for (var i = 0; i < tag_ids.length; i++) {
					tag_ids[i] = parseInt(tag_ids[i]['id']);
				}
				var req = $http.put(descantConfig.backend + "/api/v0.1/topics/" + $scope.topicId + "/", {"title": $scope.title_edited, "contents": $scope.contents_edited, "tag_ids": tag_ids});
				var ctrl = this;
				req.success(function(data) {
					ctrl.edit();
					$route.reload();
				});
			};
			
			this.deleteObj = function() {
				$http.delete(descantConfig.backend + "/api/v0.1/topics/" + $scope.topicId + "/").success(function(data) {
					$location.path('/');
				});
			};
			
			this.loadTags = function() {
				return tagService.getAllTags();
			};
			
			this.report = function(message) {
				$http.post(descantConfig.backend + "/api/v0.1/posts/" + $scope.topicId + "/report/", {'message': message}).success(function(data) {
					$location.path('/');
				}).error(function(data) {
					alert("Error!");
				});
			};
		},
		controllerAs: 'topic'
	}
});

topicViewApp.directive('replyItem', function(templateService) {
	return {
		restrict: 'E',
		templateUrl: function() {
			return 'templates/' + templateService.currentTemplateSet() + '/posts/reply-item.html';	
		},
		scope: {
			post: '='	
		},
		controller: function($http, $location, $scope, $route, descantConfig, tokenService) {
			this.editing = false;
			
			if (tokenService.user != null) {
				$scope.user = tokenService.user.data.id;
			}
			else {
				$scope.user = -1;
			}
			
			this.edit = function() {
				$scope.contents_edited = $scope.post.contents;
				this.editing = !this.editing;
			};
			
			this.editSubmit = function() {
				var req = $http.put(descantConfig.backend + "/api/v0.1/posts/" + $scope.post.id + "/", {"contents": $scope.contents_edited});
				req.success(function(data) {
					$route.reload();
				});
			};
			
			this.deleteObj = function() {
				var del = $http.delete(descantConfig.backend + "/api/v0.1/posts/" + $scope.post.id + "/");
				del.success(function(data) {
					$route.reload();
				});
				del.error(function(data) {
					alert("Unexpected error!");
				});
			};
			
			this.report = function(message) {
				$http.post(descantConfig.backend + "/api/v0.1/posts/" + $scope.post.id + "/report/", {'message': message}).success(function(data) {
					$location.path('/');
				}).error(function(data) {
					alert("Error!");
				});
			};
			
		},
		controllerAs: 'postCtrl'
	}
});

topicViewApp.directive('postList', function(descantConfig, templateService) {
	return {
		restrict: 'E',
		templateUrl: function() {
			return 'templates/' + templateService.currentTemplateSet() + '/posts/reply-list.html';	
		},
		scope: {
			url: '@',
			noPagination: '@'
		},
		controller: function($http, $interval, $route, $rootScope, $scope, tokenService) {
			var postsCtrl = this;
			this.list = [];
			this.busy = false;
			this.offset = 0;
			this.limit = descantConfig.apiPaginationLimit;
			this.end = false;
			
			this.updateList = function() {
				if (postsCtrl.busy || postsCtrl.end) {
					return;
				}
				postsCtrl.busy = true;
				var req = null;
				postsCtrl.noPagination = $scope.noPagination;
				if (postsCtrl.noPagination) {
					req = $http.get(descantConfig.backend + $scope.url);	
				}
				else {
					req = $http.get(descantConfig.backend + $scope.url + "?limit=" + postsCtrl.limit.toString() + "&offset=" + postsCtrl.offset.toString());
				}
				req.success(function (data) {
					var res = null;
					if (postsCtrl.noPagination) {
						res = [];
						res.push(data);
						postsCtrl.end = true;
					}
					else {
						if (data['results'].length == 0){
							postsCtrl.end = true;
							return;
						}
						res = data['results'];
					}
					var items = res;
      				for (var i = 0; i < items.length; i++) {
        				postsCtrl.list.push(items[i]);
      				}
					postsCtrl.offset += res.length;
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
				var req = $http.get(descantConfig.backend + $scope.url + "?limit=" + postsCtrl.offset.toString() + "&offset=0");
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
