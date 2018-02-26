app.service('ParseService', function($q) {
	let _data = []

	let self = {
		parse: data => {
			const defer = $q.defer()

			Papa.parse(data, {
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
		set: data => {
			return _data = data
		},
		get: data => {
			return _data
		},
		append: data => {
			let copy = angular.copy(data)

			_data.push(copy)
			_data = [].concat.apply([], _data)
			return _data = _.uniqBy(_data, 'phone')
		}
	}

	return {
		parse: self.parse,
		unparse: self.unparse,
		get: self.get,
		set: self.set,
		append: self.append
	}
})