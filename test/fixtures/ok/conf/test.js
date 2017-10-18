const { join } = require('path')

module.exports = {
	mono: {
		modules: [
			'mono-mongodb',
			join(__dirname, '../../../..')
		],
		mongodb: {
			url: 'mongodb://localhost:27017/mono-push-test'
		}
	}
}
