
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
	if (this.conf.io) require('./io')

	module.exports.send = send
}
