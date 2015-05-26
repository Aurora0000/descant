var app = angular.module('descant', ['ngAnimate', 'ngRoute', 'descant.config', 'descant.services']);

app.config(function($routeProvider, $locationProvider) {
		$routeProvider
    	.when('/', {
    		templateUrl: 'pages/topics.html'
    	})
		.when('/topics', {
			templateUrl: 'pages/topics.html'
		})
    	.when('/users', {
    		templateUrl: 'pages/users.html'
    	})
    	.when('/admin', {
    		templateUrl: 'pages/admin.html'
    	})
			.when('/topic/:topicId', {
				templateUrl: 'pages/post-view.html',
				controller: 'PostViewController'
			})
		.when('/chat', {
			templateUrl: 'pages/chat.html'
		})
		.when('/login', {
			templateUrl: 'pages/login.html'
		})
		.when('/logout', {
			templateUrl: 'pages/logout.html'
		})
		.when('/404', {
			templateUrl: 'pages/404.html'
		})
		.otherwise('/404');

});

app.controller('PostViewController', function($scope, $routeParams) {
	$scope.topicId = $routeParams.topicId;
});


app.directive('topicList', function(descantConfig) {
	return {
		restrict: 'E',
		templateUrl: 'templates/topics/topic-list.html',
		controller: function($http) {
			var topicsCtrl = this;
			$http.get(descantConfig.backend + "/api/v0.1/topics/").success(function (data) {
				topicsCtrl.list = data;
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
		controller: function($http, descantConfig) {
			this.showNTP = false;
			this.toggleNTP = function() {
				if (this.showNTP == true) {
					this.showNTP = false;
				} else {
					this.showNTP = true;
				}
			};
			this.addTopic = function(title, contents, tag_ids) {
				$http.post(descantConfig.backend + "/api/v0.1/topics/", {"title": title, "contents": contents, "tag_ids": [1]}).success(function(data){
					$location.path('/topics');
				})
				.error(function(data) {
					alert("Error adding topic.");
				});
			};
		},
		controllerAs: 'newTopicCtrl'
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
app.run(function ($rootScope, $timeout, $window) {
	$rootScope.$on('$routeChangeSuccess', function () {
		$timeout(function () {
			$window.scrollTo(0,0);
		}, 500);
	});
});

app.directive('navTab', function() {
  return {
    restrict: 'E',
    require: '^routeUrl',
    scope: {
      routeUrl: '@',
			routeName: '@',
			routeIcon: '@'
    },
    templateUrl: 'templates/nav/nav-tab.html',
		controller: function($scope, $location) {
		    $scope.isActive = function(route) {
		        return route === $location.path();
		    }
		},
		controllerAs: 'tabCtrl'
  }
});

app.directive('postList', function(descantConfig) {
	return {
		restrict: 'E',
		templateUrl: 'templates/posts/reply-list.html',
		controller: function($http, $scope) {
			var postsCtrl = this;
			// Hacky. TODO: improve.
			var req = $http.get(descantConfig.backend + "/api/v0.1/topics/" + $scope.topicId + "/replies/");
			req.success(function (data) {
				postsCtrl.list = data;
			});
			req.error(function(data) {
				postsCtrl.failed = true;
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

app.directive('logout', ['tokenService', '$location', function(tokenService, $location) {
	return {
		restrict: 'E',
		template: '',
		controller: function($location) {
			tokenService.logout().then(function(data){
				$location.path('/');
			}, function(data){
				alert("Cannot log out.");
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
