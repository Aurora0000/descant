angular.module('descant.config', ['ngResource'])
.config(function($resourceProvider) {
	$resourceProvider.defaults.stripTrailingSlashes = false;
})
.constant('descantConfig', {
	'backend': '//django-descant.rhcloud.com',
	'version': 0.1,
	'forumName': 'Descant Demo Forum',
	'apiPaginationLimit': 25,
	'enforcePasswordEntropy': true,
	'defaultTemplateSet': 'default',
	'languages': [
		
		//= include langs.json
		
	],
	'themes': [
		
		//= include themes.json
		
	]
});
