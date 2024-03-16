const express = require('express')
const router = express.Router()
const {register,login,findUser,getAllUser} = require('../controller/userController')


router.post('/register',register)
router.post('/login',login)
router.get('/find/:userId',findUser)
router.get('/getAllUser',getAllUser)



module.exports = router