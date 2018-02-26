app.controller('CompileCtrl', ($scope, ParseService) => {
	const PS = ParseService

	$scope.$watch(() => {
		return PS.get()
	}, (newVal, oldVal) => {
		$scope.rows = newVal
	})

	$scope.clear = () => {
		PS.set('')
		$scope.rows = PS.get()
	}

	$scope.export = (data, ev) => {
		let copy = angular.copy(data)

		PS.unparse(copy)
			.then(results => {
				filename = `D121 Compiled Data.csv`
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
			.then(() => {
				PS.set('')
				$scope.rows = PS.get()
			})
	}
})