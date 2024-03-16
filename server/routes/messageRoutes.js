const express = require('express')
const { createMessage, getMessage } = require('../controller/messageController')
const router = express.Router()


router.post('/sendMessage',createMessage)
router.get('/:chatId',getMessage)

module.exports = router