const test = require('ava')

const { join } = require('path')
const { start, stop } = require('mono-test-utils')

/*
** Tests are run in serial
*/

test('Start (env with no mono-push configured)', async (t) => {
	const { server, stdout } = await start(join(__dirname, 'fixtures/ok/'), { env: 'no-push' })

	t.true(stdout.join().includes('[mono-push] Environment: no-push'))
	await stop(server)
})
