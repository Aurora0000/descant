var controllerApp = angular.module('descant.controllers.routing', ['descant.config']);

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
	this.changeUser = function(new_username, current_password) {
		$http.post(descantConfig.backend + "/api/auth/username/", {"new_username": new_username, "current_password": current_password}).success(function(data) {
			$location.path('/');
		}).error(function(data) {
			alert(data);	
		});
	};
});