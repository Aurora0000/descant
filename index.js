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
		.when('/chat', {
			templateUrl: 'pages/chat.html'
		});

});

var topicsCtrl = function($http) {
	var topicsCtrl = this;
	$http.get("//django-descant.rhcloud.com/api/v0.1/topics").success(function (data) {
		topicsCtrl.list = data;
	});
	this.openTopic = function(id) {
		this.id = id;
		$http.get("//django-descant.rhcloud.com/api/v0.1/topics").success(function (data) {
			topicsCtrl.postList = data;
		});
	};
};

app.directive('topicList', function() {
	return {
		restrict: 'E',
		templateUrl: 'templates/topic-list.html',
		controller: topicsCtrl,
		controllerAs: 'topics'
	}
});
app.directive('userList', function() {
	return {
		restrict: 'E',
		templateUrl: 'templates/user-list.html',
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
		templateUrl: 'templates/new-topic-box.html',
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
		templateUrl: 'templates/chat-box.html'
	}
});
app.directive('adminPanel', function() {
	return {
		restrict: 'E',
		templateUrl: 'templates/admin-panel.html'
	}
});
app.run(function ($rootScope, $timeout, $window) {
	$rootScope.$on('$routeChangeSuccess', function () {
		$timeout(function () {
			$window.scrollTo(0,0);
		}, 500);
	});
});
app.controller('TabController', function($scope, $location) {
    $scope.isActive = function(route) {
        return route === $location.path();
    }
});
