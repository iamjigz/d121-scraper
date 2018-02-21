app.controller('MainCtrl', ($scope, $http, $timeout, $sce, $mdSidenav, $mdDialog, DataService) => {
	const DS = DataService

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
				$scope.toast('All Done', 'secondary')
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
				$scope.details = getDetails(text)
			}
		}, 10)

		const getDetails = text => {
			let details = {}

			arr = text.split('\n')

			const name = arr[0]
			const address = arr[1]
			const phone = findByRegex(arr, '(?:Tel:)(.*)')
			const sic = findByRegex(arr, '(?:US SIC: \\d+\\s)(.*)')
			const code = findByRegex(arr, '(?:US SIC: )(\\d+)')
			const conctact = findByRegex(arr, '((.*Director|Partner|Proprietor).*: .*)')
			const emp_size = findByRegex(arr, 'Emp: (.*)')

			details = {
				name: name,
				address: address,
				phone: phone,
				sic: sic,
				code: code,
				conctact: conctact,
				emp_size: emp_size,
				note: ''
			}

			return details
		}

		const findByRegex = (arr, rgx) => {
			const regex = new RegExp(rgx)
			const string = arr.find(i => regex.test(i))

			if (string) {
				const match = string.match(regex)
				const index = arr.findIndex(i => regex.test(i))
				const next = checkNextIndex(arr[index + 1]) ? '' : arr[index + 1]

				return match[1].concat(' ', next ? next : '').trim() || ''
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

	$scope.edit = (key, value, ev) => {
		const prompt = $mdDialog.prompt()
			.title('Edit Detail')
			.textContent(`Do you want to edit the ${key} of this business?`)
			.placeholder(`Enter a new ${key}`)
			.ariaLabel('New Value')
			.initialValue(value)
			.targetEvent(ev)
			.ok('Save')
			.cancel('Cancel')

		$mdDialog.show(prompt)
			.then(res => {
				$scope.details[key] = res
				$scope.toast(`The value for ${key} has been edited.`, 'secondary')
			}, () => {
				$scope.toast(`Editing has been cancelled`, 'warn')
			})
	}

	$scope.save = details => {
		$scope.toast(`Added ${details.name}.`, 'secondary')
		DS.set(details)
		$scope.details = ''
	}
})