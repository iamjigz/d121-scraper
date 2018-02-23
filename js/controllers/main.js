app.controller('MainCtrl', ($scope, $http, $timeout, $sce, $mdSidenav, $mdDialog, DataService) => {
	const DS = DataService

	$scope.getPdf = (url) => {
		$scope.status = 'Loading. Please Wait...'
		$http.get(`https://cors-anywhere.herokuapp.com/${url}`, {
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
				$scope.toast('Please install/enable "Allow-Control-Allow-Origin: *" extension.', 'warn')
				$scope.status = ''
			})
	}

	$scope.handlePaste = (e) => {
		$timeout(function() {
			if (e.target.value.length > 0) {
				const text = e.target.value
				$scope.copiedText = text
				$scope.details = DS.evaluate(text)
			}
		}, 10)
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