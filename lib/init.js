
const { db } = require('@terrajs/mono-mongodb')

module.exports = async ({ log, conf }) => {
	log.info('Ensuring pushs capped collection')

	const collection = await db.createCollection('pushs', { capped: true, size: 10000 })

	log.info('Ensuring pushs index sent')

	await collection.createIndex({ sent: 1 })

	log.info('Init pushs collection')

	const push = await collection.findOne({ type: 'init' })

	if (!push) await collection.insertOne({ type: 'init' })

	if (conf.mono.push.io) require('./io')
}
