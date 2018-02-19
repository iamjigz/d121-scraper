app.controller('MainCtrl', ($scope, $http, $timeout, $sce) => {

	$scope.getPdf = (url) => {
		$scope.status = "Loading..."
		$http.get(url, {
				responseType: 'arraybuffer'
			})
			.success(function(response) {
				const file = new Blob([(response)], {
					type: 'application/pdf'
				})

				const fileURL = URL.createObjectURL(file);
				$scope.pdfContent = $sce.trustAsResourceUrl(fileURL)
				$scope.status = "Done!"
			});
	}

	$scope.paste = () => {

		let text = $scope.target
		console.log(text)
	}
})