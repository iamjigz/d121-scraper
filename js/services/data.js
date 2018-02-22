app.service('DataService', function() {
	let business = []

	let self = {
		set: data => {
			return business.push(data)
		},
		get: data => {
			return business
		},
		evaluate: text => {
			let details = {}

			arr = text.split('\n')

			const address = findAddress(arr)
			const name = findName(arr, address)
			const phone = findByRegex(arr, '(?:Tel:)(.*)')
			const sic = findByRegex(arr, '(?:US SIC: \\d+\\s)(.*)')
			const code = findByRegex(arr, '(?:US SIC: )(\\d+)')
			const contact = findByRegex(arr, '((.*Director|Partner|Proprietor).*: .*)')
			const emp_size = findByRegex(arr, 'Emp: (.*)')

			const isDigits = value => {
				return /^\d+$/.test(value) ? value : ''
			}

			details = {
				name: name,
				address: address,
				phone: phone,
				sic: sic,
				code: isDigits(code),
				contact: contact,
				emp_size: isDigits(emp_size),
				note: ''
			}

			return details
		}
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

	const checkNextIndex = arr => {
		const regex = new RegExp(':', 'igm')
		return regex.test(arr)
	}

	const findName = (arr, address) => {
		const regex = new RegExp(address, 'igm')
		const index = arr.findIndex(i => regex.test(i))

		let copy = angular.copy(arr)
		let newArr = copy.splice(0, index)

		return newArr.join(' ')
	}

	const findAddress = arr => {
		const regex = new RegExp(':', 'igm')
		const index = arr.findIndex(i => regex.test(i))

		let copy = angular.copy(arr)
		let newArr = copy.splice(0, index)

		const rgxAddress = new RegExp('.*[a-zA-Z]{1,2}([0-9]{1,2}|[0-9][a-zA-Z])\\s*[0-9][a-zA-Z]{2}', 'i')
		const string = newArr.find(i => rgxAddress.test(i))

		if (string) {
			const rgxComma = new RegExp(',', 'g')
			const matchComma = newArr.find(i => rgxComma.test(i))
			const fullAddress = matchComma == string ? string : matchComma.concat(' ', string)

			return fullAddress
		}

		return ''
	}

	const validate = detail => {

	}

	return {
		set: self.set,
		get: self.get,
		evaluate: self.evaluate
	}
})