const express = require('express')
const cors = require('cors')
require('dotenv').config()
require('./db/mongoose')

const path  = require('path')
const ProjectURL = path.join(__dirname,"Housemates")

const userRouter = require('./routers/user')
const emailRouter = require('./routers/email')
const itemRouter = require('./routers/items')
const reminderRouter = require('./routers/reminder')

require('./routers/automaticserver')

const app = express()
app.use(cors())

app.use(express.json())
app.use(express.static(ProjectURL))

app.use('/api',userRouter)
app.use('/api',emailRouter)
app.use('/api',itemRouter)
app.use('/api',reminderRouter)

// app.get('/',(req,res)=>{
//     res.status(200).send("Hello Sharan Reddy")
// })
app.get('*', function(req,res) {
  res.sendFile(path.join(ProjectURL + '/index.html'));
});

module.exports = app