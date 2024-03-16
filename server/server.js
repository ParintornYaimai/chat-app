const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')
const cors = require('cors')
const userRouter = require('./routes/userRoutes') 
const chatRouter = require('./routes/chatRoutes')
const messageRoute = require('./routes/messageRoutes')
const app = express()

//connect to db
mongoose.connect(process.env.DATABASE)
.then(res=>{
    console.log('connect to db');
})
.catch(err=>{
    console.log(err);
})

//middleware
app.use(express.json())
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true,
    methods:["GET","PUT","POST","DELETE"]
})) 

//routes
app.use('/api/user',userRouter)
app.use('/api/chat',chatRouter)
app.use('/api/message',messageRoute)





app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`)
})