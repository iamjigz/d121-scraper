app.controller('MainCtrl', ($scope, $http, $timeout, $sce, $mdSidenav) => {

	$scope.getPdf = (url) => {
		$scope.status = 'Loading. Please Wait...'
		$http.get(url, {
				responseType: 'arraybuffer',
				headers: {
					'Accept': 'application/pdf'
				}
			})
			.success(function(response) {
				const file = new Blob([(response)], {
					type: 'application/pdf'
				})

				const fileURL = URL.createObjectURL(file);
				$scope.pdfContent = $sce.trustAsResourceUrl(fileURL)
				$scope.toast('All Done', 'primary')
				$scope.status = ''
			})
			.catch(err => {
				$scope.toast('Please enable Cross-Origin Request.', 'warn')
				$scope.status = ''
			})
	}

	$scope.handlePaste = (e) => {
		$timeout(function() {
			if (e.target.value.length > 0) {
				const text = e.target.value
				$scope.copiedText = text
				getDetails(text)
			}
		}, 10)

		const getDetails = text => {
			let details = {}

			arr = text.split('\n')
			console.log(arr)

			let name = arr[0]
			let phone = getValue(arr, 'Tel: (.*)')
			let sic = getValue(arr, 'US SIC: (.*)')
			let code = getValue(arr, 'US SIC: (\d*).*')
			let directors = getValue(arr, 'Director.*: (.*)')
			let emp_size = getValue(arr, 'Emp: (.*)')

			details = {
				name: name,
				phone: phone,
				sic: sic,
				code: code,
				directors: directors,
				emp_size: emp_size
			}

			console.log(details)
		}

		const getValue = (arr, text) => {
			const regex = new RegExp(text, 'g')
			const string = arr.find(i => regex.test(i))

			if (string) {
				const match = string.match(regex)[0]
				console.log(match)
			}
		}
	}



	$scope.openSidenav = () => {
		$mdSidenav('right').toggle()
	}
})