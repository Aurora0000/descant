var nBtnApp = angular.module('descant.directives.notificationbutton', ['descant.config', 'descant.services.templateservice']);

nBtnApp.directive('notificationButton', function(descantConfig, tokenService, templateService) {
  return {
    restrict: 'AE',
    templateUrl: function() {
      return 'templates/' + templateService.currentTemplateSet() + '/nav/notification-button.html';
    },
    controller: function($http, $rootScope, $interval, $scope, $location) {
        var ctrl = this;
      
        this.checkAlerts = function() {
            if (!tokenService.authenticated) {
                return;
            }
			      $http.get(descantConfig.backend + '/api/v0.1/notifications/').success(function(data) {
				        ctrl.notifications = data;
				        ctrl.notificationCount = data.length;
			      });
        };
        
        this.checkAlerts();
        this.checkNotifications = $interval(this.checkAlerts, 60000);

			  // listen on DOM destroy (removal) event, and cancel the next UI update
			  // to prevent updating time after the DOM element was removed.
			  $rootScope.$on('$destroy', function() {
				    $interval.cancel(ctrl.checkNotifications);
			  });
		
    },
    controllerAs: 'nBtnCtrl'
  }
});
