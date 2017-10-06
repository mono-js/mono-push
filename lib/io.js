const { db } = require('@terrajs/mono-mongodb')
// const { io } = require('@terrajs/mono-io')

const collection = db.collection('push')

const stream = collection.find(
	{
		viewed: false
	},
	{
		tailable: true,
		awaitdata: true,
		numberOfRetries: -1
	}
).stream()

stream.on('data', function (push) {
	console.log('push', push)
})
