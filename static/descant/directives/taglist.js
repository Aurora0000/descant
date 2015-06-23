var tagApp = angular.module('descant.directives.taglist', ['descant.config', 'descant.services.tagservice', 'descant.services.templateservice']);

tagApp.directive('tagList', function(tagService, templateService) {
	return {
		restrict: 'AE',
		templateUrl: function() {
			return 'templates/' + templateService.currentTemplateSet() + '/topics/tag-list.html';	
		},
		controller: function($rootScope, $http, $location, descantConfig) {
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