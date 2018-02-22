let app = angular.module('ngApp', ['ngMaterial', 'ngMessages', 'ngAnimate'])

app.controller('AppCtrl', ($scope, $mdToast) => {

	$scope.menuOpen = false

	$scope.toast = (text, type) => {
		const toast = $mdToast.simple()
			.textContent(text)
			.action('OK')
			.highlightAction(true)
			.highlightClass(`md-${type}`)
			.position('top right')
			.hideDelay(3000)

		$mdToast.show(toast)
	}
})