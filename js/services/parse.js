app.service('ParseService', function($q) {
	let _data = []

	let self = {
		parse: data => {
			const defer = $q.defer()
			let json = Papa.parse(data, {
				download: false,
				header: true,
				skipEmptyLines: true,
				complete: rows => {
					defer.resolve(rows)
				},
				error: err => {
					defer.reject(err)
				}
			})

			return defer.promise
		},
		unparse: data => {
			const defer = $q.defer()
			let csv = Papa.unparse(data)

			if (csv) defer.resolve(csv)
			return defer.promise
		},
		get: data => {
			return _data
		},
		append: data => {
			let copy = angular.copy(data)

			_data.push(copy)
			return _data = [].concat.apply([], _data)
		}
	}

	return {
		parse: self.parse,
		unparse: self.unparse,
		get: self.get,
		append: self.append
	}
})