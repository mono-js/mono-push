const test = require('ava')

const { join } = require('path')
const stdMocks = require('std-mocks')
const io = require('socket.io-client')
const { start, stop, $get, $post, url } = require('mono-test-utils')
const { waitFor, waitForEvent, asyncObject } = require('@terrajs/mono/utils')

/*
** Tests are run in serial
*/
let ctx
const users = {}
const sockets = {}

test('Start mono server', async (t) => {
	ctx = await start(join(__dirname, 'fixtures/ok/'))

	const stdout = ctx.stdout.join()
	t.true(stdout.includes('[mono-push] Environment: test'))
	t.true(stdout.includes('[mono-push] Boot mono-push module'))
	t.true(stdout.includes('[mono-push] Init mono-push module'))
	t.true(stdout.includes('[mono-push:mono-push] Ensuring mono-pushes capped collection'))
})

test('GET /socket.io/socket.io.js should exists', async (t) => {
	const { statusCode } = await $get('/socket.io/socket.io.js')

	t.is(statusCode, 200)
})

test('Add users', async (t) => {
	users.admin1 = (await $post('/users/admin')).body
	users.admin2 = (await $post('/users/admin')).body
	users.user1 = (await $post('/users/user')).body
	users.user2 = (await $post('/users/user')).body

	t.pass()
})

test('Create socket.io connection for every user', async (t) => {
	const promises = Object.keys(users).map(async (key) => {
		const socket = sockets[key] = io(url('/push'), { forceNew: true })
		
		await waitForEvent(socket, 'connect')
	})
	await Promise.all(promises)

	t.pass()
})

test('Check fail authentication', async (t) => {
	sockets.admin1.emit('authenticate', { token: 'bad' })
	await waitForEvent(sockets.admin1, 'unauthorized')

	t.pass()
})

test('Authenticate users', async (t) => {
	stdMocks.use()
	const promises = Object.keys(users).map(async (key) => {
		sockets[key].emit('authenticate', { token: users[key].token })
		
		await waitForEvent(sockets[key], 'authenticated')
	})
	await Promise.all(promises)
	await waitFor(300)
	stdMocks.restore()
	const { stdout } = stdMocks.flush()

	t.is(stdout.length, 4)
	t.true(stdout[0].includes('[mono-push:mono-push] User connected'))
})

test('Send push to admin users', async (t) => {
	const { send } = require('../')

	const adminEventsPromise = asyncObject({
		admin1: waitForEvent(sockets.admin1, 'message'),
		admin2: waitForEvent(sockets.admin2, 'message')
	})
	const usersEventsPromise = asyncObject({
		users1: waitForEvent(sockets.user1, 'message', 2000),
		users2: waitForEvent(sockets.user2, 'message', 2000)
	})

	await send('message', { role: 'admin' }, { message: 'Welcome!' })
	const adminEvents = await adminEventsPromise

	t.is(adminEvents.admin1[0].message, 'Welcome!')
	t.is(adminEvents.admin2[0].message, 'Welcome!')

	const error = await t.throws(usersEventsPromise)
	t.true(error.message.includes('Timeout'))
})

test('Send push to all users', async (t) => {
	const { send } = require('../')

	const eventsPromise = asyncObject({
		admin1: waitForEvent(sockets.admin1, 'message'),
		admin2: waitForEvent(sockets.admin2, 'message'),
		user1: waitForEvent(sockets.user1, 'message'),
		user2: waitForEvent(sockets.user2, 'message')
	})

	await send('message')
	const events = await eventsPromise

	t.deepEqual(events.admin1[0], {})
	t.deepEqual(events.admin2[0], {})
	t.deepEqual(events.user1[0], {})
	t.deepEqual(events.user2[0], {})
})

test('Stop mono server', async (t) => {
	stdMocks.use()
	await stop(ctx.server)
	stdMocks.restore()
	const { stdout } = stdMocks.flush()

	t.true(stdout.join().includes('[mono-push:mono-push] User disconnected'))
})
