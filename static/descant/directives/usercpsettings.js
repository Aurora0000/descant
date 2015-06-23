var cpApp = angular.module('descant.directives.usercpsettings', ['descant.services.templateservice', 'descant.services.tokenservice']);

cpApp.directive('userCpSettings', function(templateService) {
    return {
        restrict: 'AE',
        templateUrl: function() {
          return 'templates/' + templateService.currentTemplateSet() + '/settings/user-cp-settings.html';  
        },
        controller: function($http, $location, tokenService, descantConfig) {
           this.options = false;
           this.logged_in = tokenService.authenticated;
           
    
           this.changeUser = function(new_username, current_password) {
               $http.post(descantConfig.backend + "/api/auth/username/", {"new_username": new_username, "current_password": current_password}).success(function(data) {
                   $location.path('/');
               }).error(function(data) {
                   alert("Error! Is your current password correct?");
               });
           };
    
           this.changeEmail = function(new_mail) {
               $http.patch(descantConfig.backend + "/api/auth/me/", {"email": new_mail}).success(function(data) {
                   $location.path('/');
               }).error(function(data) {
                  alert("Error! Is your current password correct?");
               });
           };
    
           this.changePassword = function(new_password, current_password) {
               $http.post(descantConfig.backend + "/api/auth/password/", {"current_password": current_password, "new_password": new_password }).success(function(data) {
                   $location.path('/');
               }).error(function(data) {
                   alert("Error! Is your current password correct?");
               });
           };
    
           this.showOptions = function() {
               this.options = true;
           };
        },
        controllerAs: 'cpCtrl'
    };
});
