
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

module.exports = async function () {
	// Default conf
	this.conf.mono.push = this.conf.mono.push || {}
	this.conf.mono.push.io = this.conf.mono.push.io || false
	this.conf.mono.push.collectionName = this.conf.mono.push.collectionName || 'mono-pushes'

	module.exports.send = send
}
