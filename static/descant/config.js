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
		{
			'name': 'English',
			'value': 'en'
		},
		{
			'name': 'Deutsch',
			'value': 'de'
		},
		{
			'name': 'română',
			'value': 'ro'
		},
		{
			'name': 'français',
			'value': 'fr'
		},
		{
			'name': 'español',
			'value': 'es'
		},
		{
			'name': '简体中文',
			'value': 'zh_CN'
		}
	]
});
