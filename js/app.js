let app = angular.module('ngApp', ['ngMaterial', 'ngMessages', 'ngAnimate'])

app.controller('AppCtrl', ($scope, $mdToast, $mdDialog) => {
	$scope.menuOpen = false

	$scope.openInfo = ev => {
		$mdDialog.show({
			controller: DialogController,
			templateUrl: 'views/partials/info.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose: true
		})
	}

	$scope.toast = (text, type) => {
		const toast = $mdToast.simple()
			.textContent(text)
			.action('OK')
			.highlightAction(true)
			.highlightClass(`md-${type}`)
			.position('bottom right')
			.hideDelay(3000)

		$mdToast.show(toast)
	}

	$scope.showConfirm = (info, ev) => {
		const confirm = $mdDialog.confirm()
			.title(info.title)
			.textContent(info.text)
			.ariaLabel('Confirm')
			.targetEvent(ev)
			.ok('Okay')
			.cancel('Cancel')

		$mdDialog.show(confirm)
	}

	$scope.$watch('menuOpen', isOpen => {
		if (isOpen) {
			$timeout(() => {
				$scope.tooltip = $scope.menuOpen
			}, 600);
		} else {
			$scope.tooltip = $scope.menuOpen
		}
	})

	const DialogController = ($scope, $mdDialog) => {
		$scope.hide = () => {
			$mdDialog.hide()
		}

		$scope.cancel = () => {
			$mdDialog.cancel()
		}
	}
})

app.directive('fileReader', function(ParseService) {
	const PS = ParseService

	return {
		scope: {
			fileReader: "="
		},
		link: function(scope, element) {
			$(element).on('change', function(changeEvent) {
				let files = changeEvent.target.files

				if (files.length) {
					angular.forEach(files, file => {
						let r = new FileReader()

						r.onload = function(e) {
							let contents = e.target.result

							scope.$apply(function() {
								PS.parse(contents)
									.then(rows => {
										PS.append(rows.data)
									})
							})
						}

						r.readAsText(file)
					})
				}
			})
		}
	}
})