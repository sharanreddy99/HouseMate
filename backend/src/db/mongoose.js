const mongoose = require('mongoose')

mongoose.connect(process.env.MONGOURL,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
 