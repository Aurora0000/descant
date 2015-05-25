var app = angular.module('descant', ['ngAnimate', 'ngRoute']);

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
		});

});

app.controller('PostViewController', function($scope, $routeParams) {
	$scope.topicId = $routeParams.topicId;
});


app.directive('topicList', function() {
	return {
		restrict: 'E',
		templateUrl: 'templates/topics/topic-list.html',
		controller: function($http) {
			var topicsCtrl = this;
			$http.get("//django-descant.rhcloud.com/api/v0.1/topics").success(function (data) {
				topicsCtrl.list = data;
			});
		},
		controllerAs: 'topics'
	}
});
app.directive('userList', function() {
	return {
		restrict: 'E',
		templateUrl: 'templates/users/user-list.html',
		controller: function($http) {
			var usersCtrl = this;
			$http.get("//django-descant.rhcloud.com/api/v0.1/users").success(function (data) {
				usersCtrl.list = data;
			});
		},
		controllerAs: 'users'
	}
});
app.directive('newTopicBox', function() {
	return {
		restrict: 'E',
		templateUrl: 'templates/topics/new-topic-box.html',
		controller: function() {
			this.showNTP = false;
			this.toggleNTP = function() {
				if (this.showNTP == true) {
					this.showNTP = false;
				} else {
					this.showNTP = true;
				}
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
			routeName: '@'
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

app.directive('postList', function() {
	return {
		restrict: 'E',
		templateUrl: 'templates/posts/reply-list.html',
		controller: function($http, $scope) {
			var topicsCtrl = this;
			// Hacky. TODO: improve.
			$http.get("//django-descant.rhcloud.com/api/v0.1/topics/" + $scope.topicId + "/replies").success(function (data) {
				topicsCtrl.list = data;
			});
		},
		controllerAs: 'posts'
	}
});
