var notifListApp = angular.module('descant.directives.notificationlist', ['descant.config', 'descant.services.templateservice']);

notifListApp.directive('notificationList', function(descantConfig, templateService) {
	return {
		restrict: 'E',
		templateUrl: function() {
			return 'templates/' + templateService.currentTemplateSet() + '/notifications/notification-list.html';	
		},
		scope: {
			url: '@'	
		},
		controller: function($http, $scope, $interval, $rootScope) {
			var ctrl = this;
			this.displayModes = [
				{
					'name': 'UNREAD_NOTIFICATIONS',
					'id': '/'
				},
				{
					'name': 'ALL_NOTIFICATIONS',
					'id': '/read/'
				}
			];
			
			// Use the logical 'by newest reply' mode by default.
			this.currentDisplayMode = this.displayModes[0];
			this.url = this.displayModes[0].id;
			
			this.list = [];
			this.busy = false;
			this.offset = 0;
			this.limit = descantConfig.apiPaginationLimit;
			this.end = false;
			
			this.setDisplayMode = function(id) {
				for (var i = 0, len = this.displayModes.length; i < len; i++) {
   					if (this.displayModes[i].id == id) {   
						this.currentDisplayMode = this.displayModes[i];
						this.url = id;
						this.refreshList();
					}
				}
			};
			
			this.updateList = function() {
				if (ctrl.busy || ctrl.end) {
					return;
				}
				ctrl.busy = true;
				var req = $http.get(descantConfig.backend + "/api/v0.1/notifications" + ctrl.url + "?limit=" + ctrl.limit.toString() + "&offset=" + ctrl.offset.toString());
				req.success(function (data) {
					if (data['results'].length == 0){
						ctrl.end = true;
						return;
					}
					var items = data['results'];
      				for (var i = 0; i < items.length; i++) {
        				ctrl.list.push(items[i]);
      				}
					ctrl.offset += data['results'].length;
					ctrl.busy = false;
				});
				req.error(function(data) {
					ctrl.busy = false;
					ctrl.end = true;
				});
			};
			
			this.refreshList = function() {
				ctrl.busy = true;
				ctrl.end = false;
				var req = $http.get(descantConfig.backend + "/api/v0.1/notifications" + ctrl.url + "?limit=" + ctrl.offset.toString() + "&offset=0");
				req.success(function (data) {
					if (data['results'].length == 0){
						ctrl.end = true;
						return;
					}
					var items = data['results'];
      				ctrl.list = items;
					ctrl.busy = false;
				});
				req.error(function(data) {
					ctrl.busy = false;
					ctrl.end = true;
				});
			};
			
			// Update once every 45 seconds.
			this.stopRefreshList = $interval(this.refreshList, 45000);

			$rootScope.$on('topics:refresh', function() {
				ctrl.refreshList();
			});

			// listen on DOM destroy (removal) event, and cancel the next UI update
			// to prevent updating time after the DOM element was removed.
			$rootScope.$on('$destroy', function() {
				$interval.cancel(ctrl.stopRefreshList);
			});
		},
		controllerAs: 'notificationCtrl'
	}
});