app.controller('OutputCtrl', ($scope, $filter, $q, DataService) => {
	const DS = DataService

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

	$scope.export = data => {
		const unparse = arr => {
			const defer = $q.defer()
			let filter = $filter('filter')(arr, {
				note: 'Valid'
			}, true)

			let csv = Papa.unparse(filter)

			if (csv) defer.resolve(csv)

			return defer.promise
		}

		unparse(data)
			.then(results => {
				filename = `D121 Data Export.csv`
				let csvData = new Blob([results], {
					type: 'text/csv;charset=utf-8;'
				});
				let csvURL = window.URL.createObjectURL(csvData);
				let tempLink = document.createElement('a');

				tempLink.href = csvURL;
				tempLink.setAttribute('download', filename);
				tempLink.click();
				$scope.toast('Parsing completed. Downloading file.', 'accent')
			})
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