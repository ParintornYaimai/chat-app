const Message = require('../models/messageModel')


//createMessahe
//getMessage


exports.createMessage =async(req,res)=>{
    console.log(req.body);
    const {text,chatId,senderId} = req.body
    try {
        if(!text || !chatId || !senderId){
            return res.status(400).json({message:'Please enter a message'})
        }
        const createNewMessage = await Message.create({
            text,
            chatId,
            senderId
        })
        if(createNewMessage) return res.status(200).json(createNewMessage)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"})
    }
}

exports.getMessage =async(req,res)=>{
    const {chatId} = req.params
    try{
        const messages = await Message.find({chatId})
        if(messages){
            return res.status(200).json(messages)
        }else{
            res.status(400).json({message:'Unable to view message'})
        }
    }catch(error){
        console.log(error);
        res.status(500).json({message:'Internal server error'})
    }
}