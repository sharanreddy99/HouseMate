const mongoose = require('mongoose')

mongoose.connect(process.env.HOUSEMATE_NODE_MONGOURL,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
 