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
			'name': 'rom\u00E2n\u0103',
			'value': 'ro'
		},
		{
			'name': 'fran\u00E7ais',
			'value': 'fr'
		},
		{
			'name': 'espa\u00F1ol',
			'value': 'es'
		},
		{
			'name': '\u7B80\u4F53\u4E2D\u6587',
			'value': 'zh_CN'
		}
	]
});
