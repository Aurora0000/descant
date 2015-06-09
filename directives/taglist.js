var tagApp = angular.module('descant.directives.taglist', ['descant.config', 'descant.services.tagservice']);

tagApp.directive('tagList', function($location, tagService) {
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
				tagCtrl.list = tagService.getAllTags();
			};

			this.updateList();

		},
		controllerAs: 'tagCtrl'
	};
});