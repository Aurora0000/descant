var app = angular.module('descant', []);

app.controller('pageCtrl', function() {
	if (location.hash == '') {
		location.hash = '/topics';
	}
	this.hashPage = location.hash.replace('#/', '');
	this.currentPage = this.hashPage;
	this.currentPage = this.hashPage;
	this.isPage = function(page) {
		return this.currentPage === page;
	};
	this.setPage = function(page) {
		location.hash = '/'+page;
		this.currentPage = page;
	};
});

app.directive('topicList', function() {
	return {
		restrict: 'E',
		templateUrl: 'templates/topic-list.html',
		controller: function($http) {
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
		},
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
