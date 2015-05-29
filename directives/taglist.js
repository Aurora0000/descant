var tagApp = angular.module('descant.directives.taglist', ['descant.config']);

tagApp.directive('tagList', function($location) {
	return {
		restrict: 'E',
		templateUrl: 'templates/topics/tag-list.html',
		controller: function($rootScope, $http, descantConfig) {
			this.showTags = false;
			this.toggleBox = function() {
				if (this.showTags == true) {
					this.showTags = false;
				} else {
					this.showTags = true;
				}
			};

			var tagCtrl = this;
			this.updateList = function() {
				$http.get(descantConfig.backend + "/api/v0.1/tags/").success(function (data) {
					tagCtrl.list = data;
				});
			};

			this.updateList();

		},
		controllerAs: 'tagCtrl'
	};
});