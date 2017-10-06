
const { db } = require('@terrajs/mono-mongodb')

async function send(action, query, push) {
	const collection = db.collection('pushs')

	await collection.insertOne({
		query,
		action,
		viewed: false,
		createdAt: new Date(),
		...push
	})
}

module.exports = async function () {
	module.exports.send = send
}
