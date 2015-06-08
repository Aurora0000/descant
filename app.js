var app = angular.module('descant', ['ngAnimate', 'ngRoute', 'ngTagsInput', 'relativeDate', 'infinite-scroll',
 									 'descant.config', 'descant.services.tokenservice', 'descant.directives.authforms',
									 'descant.directives.authmisc', 'descant.directives.authstatus', 
									 'descant.directives.navbtn', 'descant.directives.newpost',
									 'descant.directives.newtopic', 'descant.directives.taglist',
									 'descant.directives.topiclist', 'descant.directives.topicview',
									 'descant.directives.topicview', 'descant.directives.userlist',
									 'descant.directives.userstats', 'descant.directives.entropyindicator',
									 'descant.filters.html', 'descant.controllers.routing']);

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
		.when('/user/:userId', {
			title: 'User Information',
			templateUrl: 'pages/user-view.html',
			controller: 'UserViewController'
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
		.when('/usercp', {
			title: 'User Control Panel',
			templateUrl: 'pages/user-cp.html',
			controller: 'UserCPController',
			controllerAs: 'cpCtrl'
		})
		.when('/404', {
			title: 'Not Found',
			templateUrl: 'pages/404.html'
		})
		.otherwise('/404');

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
angular.module('descant.config', ['ngResource'])
.config(function($resourceProvider) {
	$resourceProvider.defaults.stripTrailingSlashes = false;
})
.constant('descantConfig', {
	'backend': '//django-descant.rhcloud.com',
	'version': 0.1,
	'forumName': 'Descant Demo Forum'
});
var tagApp = angular.module('descant.services.tagservice', ['descant.config', 'ngResource']);

tagApp.factory("Tag", function($resource, $cacheFactory, descantConfig) {
  return $resource(descantConfig.backend + "/api/v0.1/tags/", {}, {
	  query: {method: 'GET', cache: true, isArray: true}
  });
});

tagApp.service('tagService', function($http, $q, $rootScope, descantConfig, Tag) {
	this.tags = [];
	this.getTagInfo = function(tagId) {
		return Tag.query().$promise.then(function(data) {
			return data[tagId - 1];
		});
	};
	this.getAllTags = function() {
		this.tags = Tag.query();
		return this.tags;
	};
    
});
var tokenApp = angular.module('descant.services.tokenservice', ['descant.config', 'LocalStorageModule']);

tokenApp.service('tokenService', function($http, $q, $rootScope, $route, descantConfig, localStorageService) {
	this.authenticated = false;
	this.token = '';
	this.login = function(user, pass) {
		this.authenticated = false;
		this.token = "";
		var serv = this;
		var req = $http.post(descantConfig.backend + '/api/auth/login/', {'username': user, 'password': pass});
		req.then(function(data) {
			serv.token = data.data['auth_token'];
			serv.authenticated = true;
  		localStorageService.set('authToken', serv.token);
			serv.setHeader();
			$rootScope.$broadcast('auth:statusChange');
			return data;
		},
		function(data){
			serv.token = "";
			serv.authenticated = false;
  		localStorageService.remove('authToken');
			return $q.reject(data);
		});
		return req;
	};
	this.logout = function() {
		var req = $http.post(descantConfig.backend + "/api/auth/logout/", {});
		var serv = this;
		req.then(function(data) {
			serv.authenticated = false;
			serv.token = "";
  		localStorageService.remove('authToken');
			serv.setHeader();
			$rootScope.$broadcast('auth:statusChange');
			return data;
		},
		function(data) {
			serv.authenticated = true;
			return $q.reject(data);
		});
		return req;
	};
	this.getToken = function() {
		if (this.authenticated) {
				return this.token;
		}
		var tokenVal = localStorageService.get('authToken');
		if (tokenVal != null) {
			this.authenticated = true;
			this.token = tokenVal;
			return this.token;
		}
		else {
			return false;
		}
	};
	this.setHeader = function() {
		var tok = this.getToken();
		if (tok != false) {
			$http.defaults.headers.common.Authorization = 'Token ' + tok;
		}
		else {
			$http.defaults.headers.common.Authorization = null;
		}
	};
	this.purgeToken = function () {
		localStorageService.remove('authToken');
	};
	this.getAuthStatus = function() {
		var ctrl = this;
		if (this.loaded && !this.error) {
			return $q(function(resolve, reject) {
				resolve(ctrl.user);
			});
		}
		var req = $http.get(descantConfig.backend + "/api/auth/me/");
		req.then(function (data) {
			ctrl.user = data;
			ctrl.loaded = true;
			ctrl.error = false;
			return data;
		},
		function(data) {
			ctrl.loaded = true;
			ctrl.error = true;
			if (this.token != '') {
				ctrl.token = '';
				ctrl.purgeToken();
				ctrl.setHeader();
				$route.reload();
			}
			return $q.reject(data);
		});
		return req;
	};
});
var authFormApp = angular.module('descant.directives.authforms', ['descant.config', 'descant.services.tokenservice']);

authFormApp.directive('loginBox', ['tokenService', '$location', function(tokenService, $location) {
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

authFormApp.directive('registerBox', function($location) {
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
	};
});var authMiscApp = angular.module('descant.directives.authmisc', ['descant.services.tokenservice']);

authMiscApp.directive('logout', ['tokenService', '$location', function(tokenService, $location) {
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

authMiscApp.directive('emitToken', ['tokenService', function(tokenService) {
	return {
		restrict: 'E',
		template: '',
		controller: function() {
			tokenService.setHeader();
		}
	}
}]);var authApp = angular.module('descant.directives.authstatus', ['descant.config', 'descant.services.tokenservice']);


authApp.directive('authStatus', ['$http', 'tokenService', 'descantConfig', function($http, tokenService, descantConfig) {
	return {
		restrict: 'E',
		templateUrl: 'templates/users/auth-status.html',
		controller: ['$http', '$scope', 'tokenService', function($http, $scope, tokenService) {
			this.tryAuth = function() {
				var ctrl = this;
				tokenService.getAuthStatus().then(function(data) {
					ctrl.user = data.data;
					ctrl.error = false;
				}, function(data) {
					ctrl.error = true;
				});
			};

			$scope.tokenServ = tokenService;
			var authCtrl = this;
			$scope.$on('auth:statusChange', function(event, data) {
				tokenService.loaded = false;
				authCtrl.tryAuth();
			});
			authCtrl.tryAuth();
		}],
		controllerAs: 'auth'
	}
}]);var entropyApp = angular.module('descant.directives.entropyindicator', []);

entropyApp.directive('entropyIndicator', function() {
  return {
    restrict: 'E',
    scope: {
    	password: '=',
		percentage: '='
    },
    templateUrl: 'templates/users/password-entropy-indicator.html',
	controller: function($scope) {
		$scope.$watch('password', function(newVal, oldVal) {
			if ($scope.password == null) {
				return;
			}
	    	// Math.log2 is only really supported in ES6, but
			// this polyfill works well enough
			Math.log2 = Math.log2 || function(x) {
  				return Math.log(x) / Math.LN2;
			};
		
			var numberRegex = /\d/;
    		var lowerRegex = /[a-z]/;
    		var upperRegex = /[A-Z]/;
    		var symbolRegex = /\W/;
			var charSpace = 0;
			
			if (numberRegex.test($scope.password)) {
				charSpace += 10;
			}
			if (lowerRegex.test($scope.password)) {
				charSpace += 26;
			}
			if (upperRegex.test($scope.password)) {
				charSpace += 26;
			}
			if (symbolRegex.test($scope.password)) {
				charSpace += 32;
			}
		
			var charEntropy = Math.log2(charSpace);
			$scope.entropy = charEntropy * $scope.password.length;
			$scope.percentage = $scope.entropy - 20;
			if ($scope.entropy < 20) {
				// All passwords should have more than 20 bits of entropy.
				$scope.percentage = 0;
			}
			else if ($scope.entropy > 120) {
				// 120 bits of entropy? Congratulations!
				$scope.percentage = 100;
			}
		});
	},
	controllerAs: 'navCtrl'
  }
});
var navApp = angular.module('descant.directives.navbtn', []);

navApp.directive('navBtn', function() {
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
var newPostApp = angular.module('descant.directives.newpost', ['descant.config', 'descant.services.tokenservice']);

newPostApp.directive('newPostBox', function($location) {
	return {
		restrict: 'E',
		templateUrl: 'templates/posts/new-post-box.html',
		scope: {
			postData: '='
		},
		controller: function(tokenService, $rootScope, $scope, $http, descantConfig) {
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
});var newTopicApp = angular.module('descant.directives.newtopic', ['descant.config', 'descant.services.tokenservice']);

newTopicApp.directive('newTopicBox', function($location) {
	return {
		restrict: 'E',
		templateUrl: 'templates/topics/new-topic-box.html',
		controller: function(tokenService, tagService, $rootScope, $http, descantConfig) {
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
var tagApp = angular.module('descant.directives.taglist', ['descant.config', 'descant.services.tagservice']);

tagApp.directive('tagList', function($location, tagService) {
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
				tagCtrl.list = tagService.getAllTags();
			};

			this.updateList();

		},
		controllerAs: 'tagCtrl'
	};
});var topicListApp = angular.module('descant.directives.topiclist', ['descant.config']);

topicListApp.directive('topicList', function(descantConfig) {
	return {
		restrict: 'E',
		templateUrl: 'templates/topics/topic-list.html',
		scope: {
			url: '@'	
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
				var req = $http.get(descantConfig.backend + $scope.url + "?limit=" + topicsCtrl.limit.toString() + "&offset=" + topicsCtrl.offset.toString());
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
				topicsCtrl.end = false;
				var req = $http.get(descantConfig.backend + $scope.url + "?limit=" + topicsCtrl.offset.toString() + "&offset=0");
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
});var topicTagsApp = angular.module('angular.directives.topictags', ['descant.services.tagservice']);

tagApp.directive('topicTags', function (tagService) {
	return {
		restrict: 'E',
		templateUrl: 'templates/topics/topic-tags.html',
		scope: {
			tagItems: '=',
		},
		controller: function ($scope) {
			this.tags = [];
			this.updateTags = function () {
				var i;
				for (i = 0; i < $scope.tagItems.length; i++) {
					var res = tagService.getTagInfo(parseInt($scope.tagItems[i]));
					var ctrl = this;
					res.then(function (data) {
						if (data != null) {
							ctrl.tags.push(data);
						}
					});

				}
			};

			this.updateTags();

		},
		controllerAs: 'tags'
	};
});var topicViewApp = angular.module('descant.directives.topicview', ['descant.config', 'descant.filters.html']);

topicViewApp.directive('topicFirstpost', function(descantConfig) {
	return {
		restrict: 'E',
		templateUrl: 'templates/topics/topic-firstpost.html',
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
		},
		controllerAs: 'topic'
	}
});

topicViewApp.directive('replyItem', function() {
	return {
		restrict: 'E',
		templateUrl: 'templates/posts/reply-item.html',
		scope: {
			post: '='	
		},
		controller: function($http, $scope, $route, descantConfig, tokenService) {
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
			
		},
		controllerAs: 'postCtrl'
	}
});

topicViewApp.directive('postList', function(descantConfig) {
	return {
		restrict: 'E',
		templateUrl: 'templates/posts/reply-list.html',
		scope: {
			url: '@'	
		},
		controller: function($http, $interval, $route, $rootScope, $scope, tokenService) {
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
				var req = $http.get(descantConfig.backend + $scope.url + "?limit=" + postsCtrl.limit.toString() + "&offset=" + postsCtrl.offset.toString());
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
var userListApp = angular.module('descant.directives.userlist', ['descant.config']);


userListApp.directive('userList', function(descantConfig) {
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
});var userStatsApp = angular.module('descant.directives.userstats', ['descant.config']);


userListApp.directive('userStats', function(descantConfig, tokenService) {
	return {
		restrict: 'E',
		scope: {
			userId: '@'
		},
		templateUrl: 'templates/users/user-stats.html',
		controller: function($http, $scope) {
			var userCtrl = this;
			tokenService.getAuthStatus().then(function(data) {
				userCtrl.user_auth = data.data;
			});
			var req = $http.get(descantConfig.backend + "/api/v0.1/users/" + $scope.userId + "/");
			req.success(function (data) {
				userCtrl.user = data;
				userCtrl.loaded = true;
			});
			req.error(function(data){
				userCtrl.loaded = true;
				userCtrl.error = true;
			});
		},
		controllerAs: 'userCtrl'
	}
});var controllerApp = angular.module('descant.controllers.routing', ['descant.config']);

controllerApp.controller('PostViewController', function($scope, $routeParams) {
	$scope.topicId = $routeParams.topicId;
});

controllerApp.controller('UserViewController', function($scope, $location, $routeParams) {
	if ($routeParams.userId != -1) {
		$scope.userId = $routeParams.userId;
	}
	else {
		$location.path('/users');
	}
});


controllerApp.controller('TagTopicViewController', function($scope, $routeParams) {
	$scope.tagId = $routeParams.tagId;
});

controllerApp.controller('ActivateController', function($http, descantConfig, $location, $routeParams) {
	var req = $http.post(descantConfig.backend + "/api/auth/activate/", {"uid": $routeParams.uid, "token": $routeParams.token});
	req.success(function(data) {
		$location.path('/login');
	});
	req.error(function(data) {
		alert("Error while activating account!");
	});
});

controllerApp.controller('UserCPController', function($http, $location, descantConfig) {
	this.options = false;
	
	this.changeUser = function(new_username, current_password) {
		$http.post(descantConfig.backend + "/api/auth/username/", {"new_username": new_username, "current_password": current_password}).success(function(data) {
			$location.path('/');
		}).error(function(data) {
			alert("Error! Is your current password correct?");
		});
	};
	
	this.changeEmail = function(new_mail) {
		$http.patch(descantConfig.backend + "/api/auth/me/", {"email": new_mail}).success(function(data) {
			$location.path('/');
		}).error(function(data) {
			alert("Error! Is your current password correct?");
		});
	};
	
	this.changePassword = function(new_password, current_password) {
		$http.post(descantConfig.backend + "/api/auth/password/", {"current_password": current_password, "new_password": new_password }).success(function(data) {
			$location.path('/');
		}).error(function(data) {
			alert("Error! Is your current password correct?");
		});
	};
	
	this.showOptions = function() {
		this.options = true;
	};
});var htmlApp = angular.module('descant.filters.html', []);

app.filter('html', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});