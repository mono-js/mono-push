
const { db } = require('@terrajs/mono-mongodb')

async function send(event, query = {}, context = {}) {
	const collection = db.collection('pushs')

	await collection.insertOne({
		query,
		event,
		context,
		sent: false,
		createdAt: new Date()
	})
}

module.exports = async function () {
	module.exports.send = send
}
