const express = require('express')
const router = express.Router()
const {createChat, findUserChats, findChat} = require('../controller/chatController')

router.post('/createChat',createChat)
router.get('/:userId',findUserChats)
router.get('/find/:firstId/:secondId',findChat)



module.exports = router