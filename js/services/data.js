app.service('DataService', function() {
	let business = []

	let self = {
		set: data => {
			return business.push(data)
		},
		get: data => {
			return business
		}
	}

	return {
		set: self.set,
		get: self.get
	}
})