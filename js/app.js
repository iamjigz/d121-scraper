let app = angular.module('ngApp', ['ngMaterial', 'ngMessages', 'ngAnimate'])

app.controller('AppCtrl', ($scope) => {

})

app.directive('pasteDirective', function() {
	var linkFn = function(scope, element, attrs) {

		element.on('paste', function() {

			setTimeout(function() {
				console.log(element.val())
				scope.pastedText = element.val()
				scope.$apply()
			}, 5)

		})
	}

	return {
		restrict: 'A',
		link: linkFn
	}
})