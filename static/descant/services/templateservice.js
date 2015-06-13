var tplApp = angular.module('descant.services.templateservice', ['descant.config', 'LocalStorageModule']);

tplApp.service('templateService', function(descantConfig, localStorageService) {
	this.currentTemplateSet = function() {
		var localStoreTpl = localStorageService.get('templateSet');
		if (localStoreTpl != null) {
			return localStoreTpl;
		}
		else {
			this.setTemplateSet(descantConfig.defaultTemplateSet);
			return descantConfig.defaultTemplateSet;
		}
	};
	this.setTemplateSet = function(newSet) {
		localStorageService.set('templateSet', newSet);
	};
});
