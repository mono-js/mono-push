
const { conf } = require('mono-core')
const { db } = require('mono-mongodb')

let collection

async function push(event, query = {}, payload = {}) {
	if (!collection) collection = db.collection(conf.mono.push.collectionName)

	await collection.insertOne({
		event,
		query,
		payload,
		sent: false,
		createdAt: new Date(),
		updatedAt: new Date()
	})
}

async function pushAll(event, payload = {}) {
	/* istanbul ignore if */
	if (!collection) collection = db.collection(conf.mono.push.collectionName)

	await collection.insertOne({
		event,
		all: true,
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

	module.exports.push = module.exports.send = push
	module.exports.pushAll = module.exports.sendAll = pushAll
}
