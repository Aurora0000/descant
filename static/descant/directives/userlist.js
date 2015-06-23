var userListApp = angular.module('descant.directives.userlist', ['descant.config', 'descant.services.templateservice']);


userListApp.directive('userList', function(descantConfig, templateService) {
	return {
		restrict: 'AE',
		templateUrl: function() {
			return 'templates/' + templateService.currentTemplateSet() + '/users/user-list.html';	
		},
		controller: function($http) {
			var usersCtrl = this;
			this.list = [];
			this.busy = false;
			this.offset = 0;
			this.limit = descantConfig.apiPaginationLimit;
			this.end = false;
			this.updateList = function() {
				if (this.busy || this.end) {
					return;
				}
				this.busy = true;
				var req = $http.get(descantConfig.backend + "/api/v0.1/users/?limit=" + this.limit.toString() + "&offset=" + this.offset.toString());
				req.success(function (data) {
					if (data['results'].length == 0){
						usersCtrl.end = true;
						return;
					}
					var items = data['results'];
      				for (var i = 0; i < items.length; i++) {
        				usersCtrl.list.push(items[i]);
      				}
					usersCtrl.offset += data['results'].length;
					usersCtrl.busy = false;
				});
				req.error(function(data) {
					usersCtrl.busy = false;
					usersCtrl.end = true;
				});
			};

		},
		controllerAs: 'users'
	}
});