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

app.controller('topicsCtrl', function($http) {
	var topicsCtrl = this;
	$http.get("//django-descant.rhcloud.com/api/v0.1/topics").success(function (data) {
		topicsCtrl.list = data;
	});
	this.showNTP = false;
	this.toggleNTP = function() {
		if (this.showNTP == true) {
			this.showNTP = false;
		} else {
			this.showNTP = true;
		}
	};
	this.mode = 'list';
	this.openTopic = function(id) {
		this.mode = 'topic';
		this.id = id;
		$http.get("//django-descant.rhcloud.com/api/v0.1/topics").success(function (data) {
			topicsCtrl.postList = data;
		});
	};
});

app.controller('usersCtrl', function($http) {
	var usersCtrl = this;
	$http.get("//django-descant.rhcloud.com/api/v0.1/users").success(function (data) {
		usersCtrl.list = data;
	});
});

app.controller('forumCtrl', function() {

});
