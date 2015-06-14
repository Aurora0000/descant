var themeApp = angular.module('descant.directives.themeselector', ['descant.services.templateservice']);

themeApp.directive('themeSelector', function(templateService) {
    return {
        restrict: 'E',
        templateUrl: function() {
          return 'templates/' + templateService.currentTemplateSet() + '/settings/theme-selector.html';  
        },
	    controller: function($translate, $window, descantConfig) {
          this.selectedTheme = templateService.currentTemplateSet(); 
            
          this.changeTheme = function() {
              templateService.setTemplateSet(this.selectedTheme.value);
              $window.location.reload();
          };
		             
          this.arr = descantConfig.themes;
    	},
    	controllerAs: 'ctrl'
    };
});
