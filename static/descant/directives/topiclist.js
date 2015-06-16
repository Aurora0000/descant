var topicListApp = angular.module('descant.directives.topiclist', ['descant.config', 'descant.services.templateservice']);

topicListApp.directive('topicList', function(descantConfig, templateService) {
	return {
		restrict: 'E',
		templateUrl: function() {
			return 'templates/' + templateService.currentTemplateSet() + '/topics/topic-list.html';	
		},
		scope: {
			url: '@'	
		},
		controller: function($http, $scope, $interval, $rootScope) {
			var topicsCtrl = this;
			this.urlBase = $scope.url;
			this.displayModes = [
				{
					'name': 'CHRONOLOGICAL',
					'id': '/'
				},
				{
					'name': 'BY_NEWEST_TOPIC',
					'id': '/newest/'
				},
				{
					'name': 'BY_NEWEST_REPLY',
					'id': '/newestreplies/'
				}
			];
			
			// Use the logical 'by newest reply' mode by default.
			this.currentDisplayMode = this.displayModes[2];
			this.url = this.urlBase + this.displayModes[2].id;
			
			this.list = [];
			this.busy = false;
			this.offset = 0;
			this.limit = descantConfig.apiPaginationLimit;
			this.end = false;
			
			this.setDisplayMode = function(id) {
				for (var i = 0, len = this.displayModes.length; i < len; i++) {
   					if (this.displayModes[i].id == id) {   
						this.currentDisplayMode = this.displayModes[i];
						this.url = this.urlBase + id;
						this.refreshList();
					}
				}
			};
			
			this.updateList = function() {
				if (topicsCtrl.busy || topicsCtrl.end) {
					return;
				}
				topicsCtrl.busy = true;
				var req = $http.get(descantConfig.backend + topicsCtrl.url + "?limit=" + topicsCtrl.limit.toString() + "&offset=" + topicsCtrl.offset.toString());
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
				var req = $http.get(descantConfig.backend + topicsCtrl.url + "?limit=" + topicsCtrl.offset.toString() + "&offset=0");
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
});