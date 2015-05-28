var app = angular.module('descant', ['ngAnimate', 'ngRoute', 'descant.config', 'descant.services', 'ngTagsInput', 'relativeDate', 'infinite-scroll']);

app.config(function($routeProvider, $locationProvider) {
		$routeProvider
    	.when('/', {
			title: 'Home',
    		templateUrl: 'pages/topics.html'
    	})
		.when('/topics', {
			title: 'Topics',
			templateUrl: 'pages/topics.html'
		})
    	.when('/users', {
			title: 'Users',
    		templateUrl: 'pages/users.html'
    	})
    	.when('/admin', {
			title: 'Administration',
    		templateUrl: 'pages/admin.html'
    	})
		.when('/topic/:topicId', {
			title: 'Topic',
			templateUrl: 'pages/post-view.html',
			controller: 'PostViewController'
		})
		.when('/topics/:tagId', {
			title: 'Topics',
			templateUrl: 'pages/tag-topics.html',
			controller: 'TagTopicViewController'
		})
		.when('/chat', {
			title: 'Chat',
			templateUrl: 'pages/chat.html'
		})
		.when('/login', {
			title: 'Log in',
			templateUrl: 'pages/login.html'
		})
		.when('/register', {
			title: 'Register',
			templateUrl: 'pages/register.html'
		})
		.when('/logout', {
			title: 'Log out',
			templateUrl: 'pages/logout.html'
		})
		.when('/activate', {
			title: 'Account Activation',
			template: '',
			controller: 'ActivateController'
		})
		.when('/registered', {
			title: 'Registration Succeeded!',
			templateUrl: 'pages/registration-done.html'
		})
		.when('/404', {
			title: 'Not Found',
			templateUrl: 'pages/404.html'
		})
		.otherwise('/404');

});

app.controller('PostViewController', function($scope, $routeParams) {
	$scope.topicId = $routeParams.topicId;
});

app.controller('TagTopicViewController', function($scope, $routeParams) {
	$scope.tagId = $routeParams.tagId;
});

app.controller('ActivateController', function($http, descantConfig, $location, $routeParams) {
	var req = $http.post(descantConfig.backend + "/api/auth/activate/", {"uid": $routeParams.uid, "token": $routeParams.token});
	req.success(function(data) {
		$location.path('/login');
	});
	req.error(function(data) {
		alert("Error while activating account!");
	});
});

app.directive('topicList', function(descantConfig) {
	return {
		restrict: 'E',
		templateUrl: 'templates/topics/topic-list.html',
		controller: function($http, $interval, $rootScope) {
			var topicsCtrl = this;
			this.list = [];
			this.busy = false;
			this.offset = 0;
			this.limit = 15;
			this.end = false;
			
			this.updateList = function() {
				if (topicsCtrl.busy || topicsCtrl.end) {
					return;
				}
				topicsCtrl.busy = true;
				var req = $http.get(descantConfig.backend + "/api/v0.1/topics/newest/?limit=" + topicsCtrl.limit.toString() + "&offset=" + topicsCtrl.offset.toString());
				req.success(function (data) {
					if (data['results'].length == 0){
						topicsCtrl.end = true;
						return;
					}
					var items = data['results'];
      				for (var i = 0; i < items.length; i++) {
        				topicsCtrl.list.push(items[i]);
      				}
					topicsCtrl.offset += data['results'].length;
					topicsCtrl.busy = false;
				});
				req.error(function(data) {
					topicsCtrl.busy = false;
					topicsCtrl.end = true;
				});
			};
			
			this.refreshList = function() {
				topicsCtrl.busy = true;
				var req = $http.get(descantConfig.backend + "/api/v0.1/topics/newest/?limit=" + topicsCtrl.offset.toString() + "&offset=0");
				req.success(function (data) {
					if (data['results'].length == 0){
						topicsCtrl.end = true;
						return;
					}
					var items = data['results'];
      				topicsCtrl.list = items;
					topicsCtrl.busy = false;
				});
				req.error(function(data) {
					topicsCtrl.busy = false;
					topicsCtrl.end = true;
				});
			};
			
			// Update once every 45 seconds.
			this.stopRefreshList = $interval(this.refreshList, 45000);

			$rootScope.$on('topics:refresh', function() {
				topicsCtrl.refreshList();
			});

			// listen on DOM destroy (removal) event, and cancel the next UI update
			// to prevent updating time after the DOM element was removed.
			$rootScope.$on('$destroy', function() {
				$interval.cancel(topicsCtrl.stopRefreshList);
			});
		},
		controllerAs: 'topics'
	}
});
app.directive('tagTopicList', function(descantConfig) {
	return {
		restrict: 'E',
		templateUrl: 'templates/topics/topic-list.html',
		scope: {
      tagId: '@'
    },
		controller: function($http, $scope, $interval, $rootScope) {
			var topicsCtrl = this;
			this.list = [];
			this.busy = false;
			this.offset = 0;
			this.limit = 15;
			this.end = false;
			
			this.updateList = function() {
				if (topicsCtrl.busy || topicsCtrl.end) {
					return;
				}
				topicsCtrl.busy = true;
				var req = $http.get(descantConfig.backend + "/api/v0.1/tags/" + $scope.tagId + "/newest/?limit=" + topicsCtrl.limit.toString() + "&offset=" + topicsCtrl.offset.toString());
				req.success(function (data) {
					if (data['results'].length == 0){
						topicsCtrl.end = true;
						return;
					}
					var items = data['results'];
      				for (var i = 0; i < items.length; i++) {
        				topicsCtrl.list.push(items[i]);
      				}
					topicsCtrl.offset += data['results'].length;
					topicsCtrl.busy = false;
				});
				req.error(function(data) {
					topicsCtrl.busy = false;
					topicsCtrl.end = true;
				});
			};
			
			this.refreshList = function() {
				topicsCtrl.busy = true;
				var req = $http.get(descantConfig.backend + "/api/v0.1/tags/" + $scope.tagId + "/newest/?limit=" + topicsCtrl.offset.toString() + "&offset=0");
				req.success(function (data) {
					if (data['results'].length == 0){
						topicsCtrl.end = true;
						return;
					}
					var items = data['results'];
      				topicsCtrl.list = items;
					topicsCtrl.busy = false;
				});
				req.error(function(data) {
					topicsCtrl.busy = false;
					topicsCtrl.end = true;
				});
			};
			
			// Update once every 45 seconds.
			this.stopRefreshList = $interval(this.refreshList, 45000);

			$rootScope.$on('topics:refresh', function() {
				topicsCtrl.refreshList();
			});

			// listen on DOM destroy (removal) event, and cancel the next UI update
			// to prevent updating time after the DOM element was removed.
			$rootScope.$on('$destroy', function() {
				$interval.cancel(topicsCtrl.stopRefreshList);
			});
		},
		controllerAs: 'topics'
	}
});

app.directive('userList', function(descantConfig) {
	return {
		restrict: 'E',
		templateUrl: 'templates/users/user-list.html',
		controller: function($http) {
			var usersCtrl = this;
			var req = $http.get(descantConfig.backend + "/api/v0.1/users/");
			req.success(function (data) {
				usersCtrl.list = data;
				usersCtrl.loaded = true;
			});
			req.error(function(data){
				usersCtrl.loaded = true;
				usersCtrl.error = true;
			});
		},
		controllerAs: 'users'
	}
});
app.directive('newTopicBox', function($location) {
	return {
		restrict: 'E',
		templateUrl: 'templates/topics/new-topic-box.html',
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
			this.addTopic = function(title, contents, tag_ids) {
				var i;
				for (i = 0; i < tag_ids.length; i++) {
					tag_ids[i] = parseInt(tag_ids[i]['id']);
				}
				var ntb = this;
				$http.post(descantConfig.backend + "/api/v0.1/topics/", {"title": title, "contents": contents, "tag_ids": tag_ids}).success(function(data){
					$location.path('/topics');
					ntb.toggleNTP();
					$rootScope.$broadcast('topics:refresh');
				})
				.error(function(data) {
					alert("Error adding topic.");
				});
			};

		},
		controllerAs: 'newTopicCtrl'
	}
});
app.directive('newPostBox', function($location) {
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
	}
});

app.directive('chatBox', function() {
	return {
		restrict: 'E',
		templateUrl: 'templates/chat/chat-box.html'
	}
});
app.directive('adminPanel', function() {
	return {
		restrict: 'E',
		templateUrl: 'templates/admin/admin-panel.html'
	}
});
app.run(function ($rootScope, $route, $timeout, $window, descantConfig) {
	$rootScope.$on('$routeChangeSuccess', function () {
		$timeout(function () {
			$window.scrollTo(0,0);
		}, 500);
		
        document.title = $route.current.title + " | " + descantConfig.forumName;        
	});
});

app.directive('navBtn', function() {
  return {
    restrict: 'E',
    require: '^routeUrl',
    scope: {
      routeUrl: '@',
			routeName: '@',
			routeIcon: '@'
    },
    templateUrl: 'templates/nav/nav-btn.html',
		controller: function($scope, $location) {
		    $scope.isActive = function(route) {
		        return route === $location.path();
		    }
		},
		controllerAs: 'navCtrl'
  }
});

app.directive('postList', function(descantConfig) {
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
app.directive('topicFirstpost', function(descantConfig) {
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

app.directive('authStatus', ['$http', 'tokenService', 'descantConfig', function($http, tokenService, descantConfig) {
	return {
		restrict: 'E',
		templateUrl: 'templates/users/auth-status.html',
		controller: ['$http', '$scope', 'tokenService', function($http, $scope, tokenService) {
			this.tryAuth = function() {
				var req = $http.get(descantConfig.backend + "/api/auth/me/");
				req.success(function (data) {
					authCtrl.user = data;
					authCtrl.loaded = true;
					authCtrl.error = false;
				});
				req.error(function(data) {
					authCtrl.loaded = true;
					authCtrl.error = true;
				});
			};

			$scope.tokenServ = tokenService;
			var authCtrl = this;
			$scope.$on('auth:statusChange', function(event, data) {
				authCtrl.tryAuth();
			});
			authCtrl.tryAuth();
		}],
		controllerAs: 'auth'
	}
}]);


app.directive('loginBox', ['tokenService', '$location', function(tokenService, $location) {
	return {
		restrict: 'E',
		templateUrl: 'templates/users/login-box.html',
		controller: function() {
			this.login = function(user, pass) {
				tokenService.login(user, pass).then(function(data){
					$location.path('/');
				}, function(data) {
					alert("Invalid user/password!");
				});
			};
		},
		controllerAs: 'loginCtrl'
	}
}]);

app.directive('registerBox', function($location) {
	return {
		restrict: 'E',
		templateUrl: 'templates/users/register-box.html',
		controller: function($http, descantConfig) {
			this.register = function(user, email, pass) {
				var req = $http.post(descantConfig.backend + "/api/auth/register/", {"email": email, "username": user, "password": pass});
				req.success(function(data) {
					$location.path('/registered');
				});
				req.error(function(data) {
					alert("There was an error while trying to register.");
				});
			};
		},
		controllerAs: 'registerCtrl'
	}
});


app.directive('logout', ['tokenService', '$location', function(tokenService, $location) {
	return {
		restrict: 'E',
		template: '',
		controller: function($location) {
			tokenService.logout().then(function(data){
				$location.path('/');
			}, function(data){
				alert("Cannot log out.");
				tokenService.purgeToken();
			});
		}
	}
}]);

app.directive('emitToken', ['tokenService', function(tokenService) {
	return {
		restrict: 'E',
		template: '',
		controller: function() {
			tokenService.setHeader();
		}
	}
}]);
app.directive('tagList', function($location) {
	return {
		restrict: 'E',
		templateUrl: 'templates/topics/tag-list.html',
		controller: function($rootScope, $http, descantConfig) {
			this.showTags = false;
			this.toggleBox = function() {
				if (this.showTags == true) {
					this.showTags = false;
				} else {
					this.showTags = true;
				}
			};

			var tagCtrl = this;
			this.updateList = function() {
				$http.get(descantConfig.backend + "/api/v0.1/tags/").success(function (data) {
					tagCtrl.list = data;
				});
			};

			this.updateList();

		},
		controllerAs: 'tagCtrl'
	}
});
