var app = angular.module('descant', ['ngAnimate', 'ngRoute', 'descant.config', 'descant.services', 'ngTagsInput', 'relativeDate']);

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
			this.loaded = false;

			this.updateList = function() {
				var req = $http.get(descantConfig.backend + "/api/v0.1/topics/");
				req.success(function (data) {
					topicsCtrl.list = data.reverse();
					topicsCtrl.loaded = true;
				});
				req.error(function(data) {
					topicsCtrl.loaded = true;
				});
			};
			this.updateList();

			// Update once per minute.
			this.stopUpdateList = $interval(this.updateList, 45000);

			$rootScope.$on('topics:refresh', function() {
				topicsCtrl.updateList();
			});

			// listen on DOM destroy (removal) event, and cancel the next UI update
			// to prevent updating time after the DOM element was removed.
			$rootScope.$on('$destroy', function() {
				$interval.cancel(topicsCtrl.stopUpdateList);
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
			this.loaded = false;

			this.updateList = function() {
				var req = $http.get(descantConfig.backend + "/api/v0.1/tags/" + $scope.tagId + "/");
				req.success(function (data) {
					topicsCtrl.list = data.reverse();
					topicsCtrl.loaded = true;
				});
				req.error(function(data) {
					topicsCtrl.loaded = true;
				});
			};
			this.updateList();

			// Update once per minute.
			this.stopUpdateList = $interval(this.updateList, 45000);

			$rootScope.$on('topics:refresh', function() {
				topicsCtrl.updateList();
			});

			// listen on DOM destroy (removal) event, and cancel the next UI update
			// to prevent updating time after the DOM element was removed.
			$rootScope.$on('$destroy', function() {
				$interval.cancel(topicsCtrl.stopUpdateList);
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
			$http.get(descantConfig.backend + "/api/v0.1/users/").success(function (data) {
				usersCtrl.list = data;
			});
		},
		controllerAs: 'users'
	}
});
app.directive('newTopicBox', function($location) {
	return {
		restrict: 'E',
		templateUrl: 'templates/topics/new-topic-box.html',
		controller: function($rootScope, $http, descantConfig) {
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
					$rootScope.$broadcast('topics:refresh')
				})
				.error(function(data) {
					alert("Error adding topic.");
				});
			};

			this.loadTags = function() {
				return $http.get(descantConfig.backend + "/api/v0.1/tags/");
			};
		},
		controllerAs: 'newTopicCtrl'
	}
});
app.directive('newPostBox', function($location) {
	return {
		restrict: 'E',
		templateUrl: 'templates/posts/new-post-box.html',
		controller: function($rootScope, $http, descantConfig) {
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
					alert("Error adding topic.");
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
			// Hacky. TODO: improve.

			this.updateList = function() {
				var req = $http.get(descantConfig.backend + "/api/v0.1/topics/" + $scope.topicId + "/replies/");
				req.success(function (data) {
					postsCtrl.list = data;
				});
				req.error(function(data) {
					postsCtrl.failed = true;
				});
			};
			this.updateList();

			// Update once per minute.
			this.stopUpdateList = $interval(this.updateList, 45000);

			$rootScope.$on('topic:refresh', function() {
				postsCtrl.updateList();
			});

			// listen on DOM destroy (removal) event, and cancel the next UI update
			// to prevent updating time after the DOM element was removed.
			$rootScope.$on('$destroy', function() {
				$interval.cancel(postsCtrl.stopUpdateList);
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
			// Hacky. TODO: improve.
			$http.get(descantConfig.backend + "/api/v0.1/topics/" + $scope.topicId + "/").success(function (data) {
				topicCtrl.post = data;
				topicCtrl.loaded = true;
				document.title = topicCtrl.post.title + " | " + descantConfig.forumName;
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
					authCtrl.fail = false;
				});
				req.error(function(data) {
					authCtrl.user = null;
					authCtrl.fail = true;
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
