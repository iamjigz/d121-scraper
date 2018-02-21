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
			let address = arr[1]
			let phone = findByRegex(arr, '(?:Tel:)(.*)')
			let sic = findByRegex(arr, '(?:US SIC: \\d+\\s)(.*)')
			let code = findByRegex(arr, '(?:US SIC: )(\\d+)')
			let directors = findByRegex(arr, '((.*Director|Partner|Proprietor).*: .*)')
			let emp_size = findByRegex(arr, 'Emp: (.*)')

			details = {
				name: name,
				address: address,
				phone: phone,
				sic: sic,
				code: code,
				directors: directors,
				emp_size: emp_size
			}

			console.log(details)
		}

		const findByRegex = (arr, rgx) => {
			const regex = new RegExp(rgx)
			const string = arr.find(i => regex.test(i))

			if (string) {
				const match = string.match(regex)
				const index = arr.findIndex(i => regex.test(i))
				const next = checkNextIndex(arr[index + 1]) ? '' : arr[index + 1]
				const value = next ? match[1].concat(' ', next) : match[1]

				return value || ''
			}

			return ''
		}

		const checkNextIndex = (arr) => {
			const regex = new RegExp(':', 'igm')
			return regex.test(arr)
		}
	}



	$scope.openSidenav = () => {
		$mdSidenav('right').toggle()
	}
})