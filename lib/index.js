
const { conf } = require('@terrajs/mono')
const { db } = require('mono-mongodb')

async function send(event, query = {}, payload = {}) {
	const collection = db.collection(conf.mono.push.collectionName)

	await collection.insertOne({
		event,
		query,
		payload,
		sent: false,
		createdAt: new Date(),
		updatedAt: new Date()
	})
}

module.exports = async function ({ conf }) {
	// Default conf
	conf.mono.push = conf.mono.push || {}
	conf.mono.push.io = conf.mono.push.io || false
	conf.mono.push.collectionName = conf.mono.push.collectionName || 'mono-pushes'

	module.exports.send = send
}
