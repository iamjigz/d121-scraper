app.controller('CompileCtrl', ($scope, ParseService) => {
	const PS = ParseService

	$scope.$watch(() => {
		return PS.get()
	}, (newVal, oldVal) => {
		$scope.rows = newVal
	})
})