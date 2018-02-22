let app = angular.module('ngApp', ['ngMaterial', 'ngMessages', 'ngAnimate'])

app.controller('AppCtrl', ($scope, $mdToast) => {
	$scope.menuOpen = false

	$scope.toast = (text, type) => {
		const toast = $mdToast.simple()
			.textContent(text)
			.action('OK')
			.highlightAction(true)
			.highlightClass(`md-${type}`)
			.position('bottom right')
			.hideDelay(3000)

		$mdToast.show(toast)
	}

	$scope.$watch('menuOpen', function(isOpen) {
		if (isOpen) {
			$timeout(function() {
				$scope.tooltip = $scope.menuOpen
			}, 600);
		} else {
			$scope.tooltip = $scope.menuOpen
		}
	});
})