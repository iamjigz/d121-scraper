app.controller('OutputCtrl', ($scope, DataService) => {
	const DS = DataService

	$scope.$watch(() => {
		return DS.get()
	}, (newVal, oldVal) => {
		$scope.response = newVal
	})

	$scope.delete = item => {
		console.log(item)
		$scope.response.splice($scope.response.indexOf(item), 1)
	}
})