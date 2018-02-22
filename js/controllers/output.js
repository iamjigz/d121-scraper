app.controller('OutputCtrl', ($scope, $filter, $mdMenu, DataService) => {
	const DS = DataService
	let originatorEv
	// $scope.options = false

	$scope.options = ($mdMenu, ev) => {
		originatorEv = ev
		$mdMenu.open(ev)
	}

	$scope.$watch(() => {
		return DS.get()
	}, (newVal, oldVal) => {
		$scope.response = newVal
	})

	$scope.delete = item => {
		$scope.response.splice($scope.response.indexOf(item), 1)
	}

	$scope.filter = arr => {
		let saved = DS.get()
		let filter = $filter('filter')(arr, {
			note: 'Invalid'
		})

		$scope.response = (saved.length == arr.length) ? filter : saved
	}

	$scope.$watch('response', (newVal, oldVal) => {
		$scope.dataCounter = {
			valid: 0,
			invalid: 0,
		}

		$scope.response.forEach(item => {
			if (!item) return
			if (item.note == 'Valid') return $scope.dataCounter.valid++
				if (item.note == 'Invalid') return $scope.dataCounter.invalid++
		})
	}, true)
})