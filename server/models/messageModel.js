const mongoose = require('mongoose')
const {Schema} = require('mongoose')

const messageSchem = mongoose.Schema({
    chatId:{
        type:Schema.Types.ObjectId,
        required:true
    },
    senderId:{
        type:Schema.Types.ObjectId,
        required:true
    },
    text:{
        type:String,
        required:true
    },
},{timestamps:true})

module.exports = mongoose.model('Message',messageSchem)