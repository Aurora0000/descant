var topicListApp = angular.module('descant.directives.topiclist', ['descant.config']);

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
});