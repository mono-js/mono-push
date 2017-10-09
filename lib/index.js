
const { db } = require('@terrajs/mono-mongodb')

async function send(event, query = {}, payload = {}) {
	const collection = db.collection('pushs')

	await collection.insertOne({
		event,
		query,
		payload,
		sent: false,
		createdAt: new Date()
	})
}

module.exports = async function () {
	module.exports.send = send
}
