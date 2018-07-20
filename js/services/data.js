app.service('DataService', function() {
	let _data = []

	let self = {
		append: data => {
			return _data.push(validate(data))
		},
		get: data => {
			return _data
		},
		set: data => {
			return _data = data
		},
		validate: data => {
			return validate(data)
		},
		evaluate: text => {
			let details = {}

			arr = text.split('\n')

			const address = findAddress(arr)
			const name = findName(arr, address)
			const phone = findByRegex(arr, '(?:Tel: )(\\d+)')
			const sic = findByRegex(arr, '(?:US SIC: \\d+\\s)(.*)')
			const code = findByRegex(arr, '(?:US SIC: )(\\d+)')
			const contact = findByRegex(arr, '((.*Director|Partner|Proprietor).*: .*)')
			const emp_size = findByRegex(arr, 'Emp: (\\d+)')

			details = {
				name: name,
				address: address,
				phone: phone,
				sic: sic,
				code: code,
				contact: contact,
				emp_size: emp_size,
				note: ''
			}

			return validate(details)
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
		const isDigits = value => {
			return /^\d+$/.test(value) ? value : ''
		}

		detail.note = 'Valid'
		detail.phone = isDigits(detail.phone) ? detail.phone.replace(/\b(0(?!\b))+/g, '') : ''
		detail.code = isDigits(detail.code)
		detail.emp_size = isDigits(detail.emp_size)

		if (detail.name == '' || detail.phone == '' || detail.emp_size < 10 || detail.phone.match(/^(84).*$/)) detail.note = 'Invalid'

		return detail
	}

	return {
		append: self.append,
		get: self.get,
		set: self.set,
		validate: self.validate,
		evaluate: self.evaluate
	}
})
