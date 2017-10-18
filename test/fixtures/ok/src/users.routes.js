const Joi = require('joi')
const mongoUtils = require('mongodb-utils')
const { jwt } = require('@terrajs/mono')
const { db } = require('mono-mongodb')

const collection = mongoUtils(db.collection('users'))

module.exports = [
	{
		method: 'POST',
		path: '/users/:role',
		validate: {
			params: Joi.object().keys({
				role: Joi.string().alphanum().required()
			})
		},
		async handler(req, res) {
			const { role } = req.params

			const user = await collection.utils.create({ role })

			res.json({
				token: await jwt.generateJWT({ userId: user._id, role: user.role }),
				...user
			})
		}
	}
]