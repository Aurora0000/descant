var localeApp = angular.module('descant.directives.localeselector', ['pascalprecht.translate']);

localeApp.directive('localeSelector', function() {
    return {
        restrict: 'E',
        templateUrl: 'templates/settings/locale-selector.html',
	      controller: function($translate) {
            this.selectedLanguage = "select"; 
            
            this.changeLanguage = function() {
                $translate.use(this.selectedLanguage);
            };
    	  },
    	  controllerAs: 'ctrl'
    };
});
