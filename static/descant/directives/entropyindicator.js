var entropyApp = angular.module('descant.directives.entropyindicator', []);

entropyApp.directive('entropyIndicator', function() {
  return {
    restrict: 'E',
    scope: {
    	password: '=',
		percentage: '='
    },
    templateUrl: 'templates/users/password-entropy-indicator.html',
	controller: function($scope) {
		$scope.$watch('password', function(newVal, oldVal) {
			if ($scope.password == null) {
				return;
			}
	    	// Math.log2 is only really supported in ES6, but
			// this polyfill works well enough
			Math.log2 = Math.log2 || function(x) {
  				return Math.log(x) / Math.LN2;
			};
		
			var numberRegex = /\d/;
    		var lowerRegex = /[a-z]/;
    		var upperRegex = /[A-Z]/;
    		var symbolRegex = /\W/;
			var charSpace = 0;
			
			if (numberRegex.test($scope.password)) {
				charSpace += 10;
			}
			if (lowerRegex.test($scope.password)) {
				charSpace += 26;
			}
			if (upperRegex.test($scope.password)) {
				charSpace += 26;
			}
			if (symbolRegex.test($scope.password)) {
				charSpace += 32;
			}
		
			var charEntropy = Math.log2(charSpace);
			$scope.entropy = charEntropy * $scope.password.length;
			$scope.percentage = $scope.entropy - 20;
			if ($scope.entropy < 20) {
				// All passwords should have more than 20 bits of entropy.
				$scope.percentage = 0;
			}
			else if ($scope.entropy > 120) {
				// 120 bits of entropy? Congratulations!
				$scope.percentage = 100;
			}
		});
	},
	controllerAs: 'navCtrl'
  }
});
