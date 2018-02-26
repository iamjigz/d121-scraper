app.controller('OutputCtrl', ($scope, $filter, DataService, ParseService) => {
	const DS = DataService
	const PS = ParseService

	$scope.$watch(() => {
		return DS.get()
	}, (newVal, oldVal) => {
		$scope.response = newVal
	})

	$scope.update = (item, rowIndex, prop, value) => {
		let row = $scope.response[rowIndex]
		row[prop] = value

		let newItem = row = DS.validate(row)
		$scope.toast(`${row.name} has been updated.`, 'accent')
	}

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

	$scope.export = (data, ev) => {
		let copy = angular.copy(data)
		let filter = $filter('filter')(copy, {
			note: 'Valid'
		}, true)

		PS.unparse(filter)
			.then(results => {
				filename = `D121 Data Export.csv`
				let csvData = new Blob([results], {
					type: 'text/csv;charset=utf-8;'
				})
				let csvURL = window.URL.createObjectURL(csvData)
				let tempLink = document.createElement('a')

				tempLink.href = csvURL
				tempLink.setAttribute('download', filename)
				tempLink.click()
				$scope.toast('Parsing completed. Downloading file.', 'accent')
			})
			.then(() => {
				DS.set([])
				$scope.response = DS.get()
			})
	}

	$scope.$watchCollection('response', (newVal, oldVal) => {
		$scope.dataCounter = {
			valid: 0,
			invalid: 0,
		}
		if ($scope.response) {
			$scope.response.forEach(item => {
				if (!item) return
				if (item.note == 'Valid') return $scope.dataCounter.valid++
					if (item.note == 'Invalid') return $scope.dataCounter.invalid++
			})
		}
	})
})