var tagApp = angular.module('descant.services.tagservice', ['descant.config']);

tagApp.service('tagService', function($http, $q, $rootScope, descantConfig) {
	this.tags = [];
	this.fetched = false;
	this.getTagInfo = function(tagId) {
		var serv = this;
		if (!this.fetched) {
			return this.fetch().then(function(data) {
				return serv.tags[tagId - 1];
			});
		}
		var inf = this.tags[tagId - 1];
		return $q(function(resolve, reject) {
			resolve(inf);
		});
	};
	this.getAllTags = function() {
		if (!this.fetched) {
			var serv = this;
			return this.fetch().then(function(data){
				return serv.tags;
			});
		}	
		var inf = this.tags;
		return $q(function(resolve, reject) {
			resolve(inf);
		});
	};
	this.fetch = function() {
		var serv = this;
		return $http.get(descantConfig.backend + "/api/v0.1/tags/").then(
		function (data) {
			serv.tags = data.data;
			serv.fetched = true;
			return data.data;
		}, function(data) {
			// TODO: Refetch if there was an error.
			serv.fetched = true;
			return $q.reject(data);
		});
	};
});
