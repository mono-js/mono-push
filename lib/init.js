
const { db } = require('mono-mongodb')

module.exports = async ({ log, conf }) => {
	const collectionName = conf.mono.push.collectionName
	log.info(`Ensuring ${collectionName} capped collection`)

	const collection = await db.createCollection(collectionName, { capped: true, size: 10000 })

	log.info(`Ensuring ${collectionName} 'sent' index`)
	await collection.createIndex({ sent: 1 })

	log.info(`Init ${collectionName} collection`)
	const push = await collection.findOne({ type: 'init' })

	if (!push) await collection.insertOne({ type: 'init' })

	if (conf.mono.push.io) require('./io')({ log, conf })
}
