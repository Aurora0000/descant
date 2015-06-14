var localeApp = angular.module('descant.directives.localeselector', ['pascalprecht.translate', 'descant.services.templateservice']);

localeApp.directive('localeSelector', function(templateService) {
    return {
        restrict: 'E',
        templateUrl: function() {
          return 'templates/' + templateService.currentTemplateSet() + '/settings/locale-selector.html';  
        },
	      controller: function($translate, descantConfig) {
            this.selectedLanguage = "select"; 
            
            this.changeLanguage = function() {
                $translate.use(this.selectedLanguage.value);
            };
            
            this.localearr = descantConfig.languages;
    	  },
    	  controllerAs: 'localeCtrl'
    };
});
