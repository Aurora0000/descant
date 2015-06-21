var pageApp = angular.module('descant.directives.pages', ['descant.services.templateservice']);

pageApp.directive('pageNotFound', function(templateService) {
	return {
		restrict: 'E',
		templateUrl: function() {
			return 'templates/' + templateService.currentTemplateSet() + '/pages/404.html';
		}
	}
});

pageApp.directive('pageLogin', function(templateService) {
	return {
		restrict: 'E',
		templateUrl: function() {
			return 'templates/' + templateService.currentTemplateSet() + '/pages/login.html';
		}
	}
});

pageApp.directive('pageLogout', function(templateService) {
	return {
		restrict: 'E',
		templateUrl: function() {
			return 'templates/' + templateService.currentTemplateSet() + '/pages/logout.html';
		}
	}
});

pageApp.directive('pagePostView', function(templateService) {
	return {
		restrict: 'E',
		templateUrl: function() {
			return 'templates/' + templateService.currentTemplateSet() + '/pages/post-view.html';
		}
	}
});

pageApp.directive('pageRegister', function(templateService) {
	return {
		restrict: 'E',
		templateUrl: function() {
			return 'templates/' + templateService.currentTemplateSet() + '/pages/register.html';
		}
	}
});

pageApp.directive('pageRegistrationDone', function(templateService) {
	return {
		restrict: 'E',
		templateUrl: function() {
			return 'templates/' + templateService.currentTemplateSet() + '/pages/registration-done.html';
		}
	}
});

pageApp.directive('pageResetPass', function(templateService) {
	return {
		restrict: 'E',
		templateUrl: function() {
			return 'templates/' + templateService.currentTemplateSet() + '/pages/reset-pass.html';
		}
	}
});

pageApp.directive('pageResetPassConfirm', function(templateService) {
	return {
		restrict: 'E',
		templateUrl: function() {
			return 'templates/' + templateService.currentTemplateSet() + '/pages/reset-pass-confirm.html';
		}
	}
});

pageApp.directive('pageTagTopics', function(templateService) {
	return {
		restrict: 'E',
		templateUrl: function() {
			return 'templates/' + templateService.currentTemplateSet() + '/pages/tag-topics.html';
		}
	}
});

pageApp.directive('pageTopics', function(templateService) {
	return {
		restrict: 'E',
		templateUrl: function() {
			return 'templates/' + templateService.currentTemplateSet() + '/pages/topics.html';
		}
	}
});

pageApp.directive('pageUserCp', function(templateService) {
	return {
		restrict: 'E',
		templateUrl: function() {
			return 'templates/' + templateService.currentTemplateSet() + '/pages/user-cp.html';
		}
	}
});

pageApp.directive('pageUserView', function(templateService) {
	return {
		restrict: 'E',
		templateUrl: function() {
			return 'templates/' + templateService.currentTemplateSet() + '/pages/user-view.html';
		}
	}
});

pageApp.directive('pageUsers', function(templateService) {
	return {
		restrict: 'E',
		templateUrl: function() {
			return 'templates/' + templateService.currentTemplateSet() + '/pages/users.html';
		}
	}
});

pageApp.directive('pageNotifications', function(templateService) {
	return {
		restrict: 'E',
		templateUrl: function () {
			return 'templates/' + templateService.currentTemplateSet() + '/pages/notifications.html';
		}
	}
});

pageApp.directive('pageNotificationView', function(templateService) {
	return {
		restrict: 'E',
		templateUrl: function () {
			return 'templates/' + templateService.currentTemplateSet() + '/pages/notification-view.html';
		}
	}
});