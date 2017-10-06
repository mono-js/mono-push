
const { db } = require('@terrajs/mono-mongodb')

module.exports = async ({ log }) => {
	log.info('Ensuring pushs capped collection')

	const collection = await db.createCollection('pushs', { capped: true, size: 10000 })

	const push = await collection.findOne({ type: 'init' })

	if (!push) await collection.insertOne({ type: 'init' })
}
