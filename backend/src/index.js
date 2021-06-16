const app = require('./app')
const port = process.env.HOUSEMATE_NODE_PORT
app.listen(port,(err) => {
    if(err){
        console.log("Error Occured...")
    }
    console.log('Server is Running on Port: ',port)
    console.log('URL for MONGODB is: ',process.env.HOUSEMATE_NODE_MONGOURL)
})