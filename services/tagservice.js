var tagApp = angular.module('descant.services.tagservice', ['descant.config', 'ngResource']);

tagApp.factory("Tag", function($resource, $cacheFactory, descantConfig) {
  return $resource(descantConfig.backend + "/api/v0.1/tags/", {}, {
	  query: {method: 'GET', cache: true, isArray: true}
  });
});

tagApp.service('tagService', function($http, $q, $rootScope, descantConfig, Tag) {
	this.tags = [];
	this.getTagInfo = function(tagId) {
		return Tag.query().$promise.then(function(data) {
			return data[tagId - 1];
		});
	};
	this.getAllTags = function() {
		this.tags = Tag.query();
		return this.tags;
	};
    
});
