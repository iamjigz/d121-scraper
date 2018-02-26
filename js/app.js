let app = angular.module('ngApp', ['ngMaterial', 'ngMessages', 'ngAnimate'])

app.controller('AppCtrl', ($scope, $mdToast, $mdDialog) => {
	$scope.menuOpen = false

	$scope.theme = 'default'
	$scope.changeTheme = function() {
		var themes = ['default', 'indigo', 'lime', 'orange', 'cyan', 'pink', 'brown']
		var randomize = function(arr) {
			return arr[Math.floor(Math.random() * arr.length)]
		}

		$scope.theme = randomize(themes)
	}

	$scope.darkTheme = () => {
		$scope.theme = ($scope.theme == 'dark') ? 'default' : 'dark'
	}

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
		link: (scope, element) => {
			$(element).on('change', changeEvent => {
				let files = changeEvent.target.files

				if (files.length) {
					angular.forEach(files, file => {
						let r = new FileReader()

						r.onload = e => {
							let contents = e.target.result

							scope.$apply(() => {
								PS.parse(contents)
									.then(rows => {
										PS.append(rows.data)
									})
							})
						}

						r.readAsText(file)
					})
				}
				$(element).val(null)
			})
		}
	}
})

app.config(function($mdThemingProvider) {
	$mdThemingProvider.theme('default')
		.primaryPalette('indigo')
		.accentPalette('pink')

	$mdThemingProvider.theme('dark')
		.primaryPalette('indigo')
		.accentPalette('pink')
		.dark()

	$mdThemingProvider.theme('indigo')
		.primaryPalette('green')
		.accentPalette('deep-orange')

	$mdThemingProvider.theme('lime')
		.primaryPalette('lime')
		.accentPalette('deep-orange')

	$mdThemingProvider.theme('orange')
		.primaryPalette('orange')
		.accentPalette('red')

	$mdThemingProvider.theme('cyan')
		.primaryPalette('cyan')
		.accentPalette('indigo')

	$mdThemingProvider.theme('pink')
		.primaryPalette('pink')
		.accentPalette('deep-purple')

	$mdThemingProvider.theme('brown')
		.primaryPalette('brown')
		.accentPalette('grey')

	$mdThemingProvider.alwaysWatchTheme(true)
})