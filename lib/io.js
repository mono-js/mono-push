const _ = require('lodash')
const { db } = require('@terrajs/mono-mongodb')
const { io } = require('@terrajs/mono-io')
const socketIoJwt = require('socketio-jwt')

const sockets = []

module.exports = ({ log, conf }) => {
	log = log.module('mono-push')

	// Create JWT middleware
	const jwtAuth = socketIoJwt.authorize({
		secret: conf.mono.jwt.secret,
		decodedPropertyName: 'session',
		timeout: 15000 // 15 seconds
	})

	// Create namespace
	const namespace = io.of('/push')
	namespace.on('connection', jwtAuth)
	namespace.on('authenticated', (socket) => {
		log.verbose(`User connected: ${socket.session.userId}`)
		sockets.push(socket)
		socket.on('disconnect', () => {
			log.verbose(`User disconnected: ${socket.session.userId}`)
			_.remove(sockets, socket)
		})
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
		const pushSockets = _.filter(sockets, { session: push.query })

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
