const _ = require('lodash')
const { db } = require('@terrajs/mono-mongodb')
const { io } = require('@terrajs/mono-io')

const sockets = []

io.on('connection', function (socket) {
	sockets.push(socket)
})

const collection = db.collection('pushs')

const stream = collection.find(
	{
		sent: false
	},
	{
		tailable: true
	}
).stream()

stream.on('data', async function (push) {
	const pushSockets = _.filter(sockets, { decoded_token: push.query })

	if (!pushSockets) return

	pushSockets.forEach((socket) => socket.emit(push.event, push.context))

	await collection.updateOne({ _id: push._id }, { $set: { sent: true } });
})
