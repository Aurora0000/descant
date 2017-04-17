var localeApp = angular.module('descant.directives.localeselector', ['pascalprecht.translate', 'descant.services.templateservice']);

localeApp.directive('localeSelector', function(templateService) {
    return {
        restrict: 'E',
        templateUrl: function() {
          return 'templates/' + templateService.currentTemplateSet() + '/settings/locale-selector.html';  
        },
	      controller: function($translate) {
            this.selectedLanguage = "select"; 
            
            this.changeLanguage = function() {
                $translate.use(this.selectedLanguage);
            };
    	  },
    	  controllerAs: 'ctrl'
    };
});
