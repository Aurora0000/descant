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
app.directive('replyBox', function() {
	return {
		restrict: 'E',
		templateUrl: 'templates/reply-box.html',
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
		controllerAs: 'replyCtrl'
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
