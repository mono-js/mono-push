const { join } = require('path')

module.exports = {
	mono: {
		http: {
			port: 6789
		},
		modules: [
			'mono-mongodb',
			join(__dirname, '../../../..')
		],
		mongodb: {
			url: 'mongodb://localhost:27017/mono-push-test-no-push',
			dropDatabase: true
		}
	}
}
