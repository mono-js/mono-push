const _ = require('lodash')
const { db } = require('mono-mongodb')
const { io } = require('mono-io')
const socketIoJwt = require('socketio-jwt')

module.exports = ({ log, conf }) => {
	// Create JWT middleware
	const jwtAuth = socketIoJwt.authorize({
		secret: conf.mono.jwt.secret,
		decodedPropertyName: 'session',
		required: false
	})

	// Create namespace
	const namespace = io.of('/push')

	namespace.on('connection', (socket) => {
    // Add authentication (optional)
    jwtAuth(socket)
    // Handle disctionnection
    socket.on('disconnect', () => {
      if (socket.session) log.verbose(`User disconnected: ${socket.session.username || socket.session.userId}`)
    })
  })
	namespace.on('authenticated', (socket) => log.verbose(`User authenticated: ${socket.session.username || socket.session.userId}`))

	const collection = db.collection(conf.mono.push.collectionName)
	const stream = collection.find(
		{
			sent: false
		},
		{
			tailable: true,
			awaitdata: true
		}
	).stream()

	stream.on('data', async function (push) {
    const sockets = Object.values(namespace.sockets)
		const pushSockets = (push.all ? sockets : _.filter(sockets, { session: push.query }))

		pushSockets.forEach((socket) => socket.emit(push.event, push.payload))

		await collection.updateOne(
			{
				_id: push._id
			},
			{
				$set: {
					sent: true,
					updatedAt: new Date()
				}
			}
		)
	})
}
