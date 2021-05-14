const User = require('./../models/user')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

auth = async (req,res,next) => {
    
    try{
        
        const user = await User.findByCredentials(req.body.email,req.body.password);
        const token = req.headers.authorization.replace('Bearer ','');
        if(!user)
            throw new Error('Unauthorized');
        if(token!==user.token)
            throw new Error('Unauthorized');
        
        req.body.userid = user._id;
        next()

    }catch(e){
        res.status(401).send({ error: 'Please authenticate.' });
    }
}

module.exports = auth