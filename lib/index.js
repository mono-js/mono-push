
const { db } = require('@terrajs/mono-mongodb')

async function send(push) {
	const collection = db.collection('pushs')

	await collection.insertOne({
		viewed: false,
		createdAt: new Date(),
		...push
	})
}

module.exports = async function () {
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

	module.exports.send = send
}
