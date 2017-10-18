const test = require('ava')

const { join } = require('path')
const { start, stop } = require('mono-test-utils')

/*
** Tests are run in serial
*/
let ctx

test('Start mono server', async (t) => {
	ctx = await start(join(__dirname, 'fixtures/ok/'))

	const stdout = ctx.stdout.join()
	t.true(stdout.includes('[mono-push] Environment: test'))
	t.true(stdout.includes('[mono-push] Boot mono-push module'))
	t.true(stdout.includes('[mono-push] Init mono-push module'))
	t.true(stdout.includes('[mono-push:mono-push] Ensuring mono-pushes capped collection'))
})

test.after('Stop mono server', async (t) => {
	await stop(ctx.server)
})
