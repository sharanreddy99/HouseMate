const express = require('express')

const User = require('../models/user')
const Item = require('../models/items')
const Reminder = require('../models/reminder')

const { find, findOne } = require('../models/user')
const jwt = require('jsonwebtoken')
const router  = new express.Router()

router.post('/signup', async (req,res)=>{
    try{

        const user = new User({
            fname: req.body.fn,
            lname: req.body.ln,
            email: req.body.email,
            password: req.body.pass
        })

        await user.save()

        res.status(201).send({msg: "Signup Successful. You can login now."})
    }catch(e){
        res.status(403).send({msg: "Email-ID is already registered. Try again with a new one."})
    }  
})

router.post('/login',async (req,res) => {

    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.status(201).send({email:user.email,password:req.body.password,token})

    }catch(e){
        console.log(e);
        res.status(401).send({error: e})
    }
})

router.post('/logout',async (req,res) => {

    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        var changeuser = user;
        changeuser.token = '';
        await changeuser.save()
        res.status(201).send()

    }catch(e){
        console.log(e);
        res.status(401).send({error: e})
    }
})

router.post('/verifyemail', async (req,res) => {

    try{
        const user = await User.findOne({email:req.body.email});
        if(!user)
            throw new Error();

        res.status(201).send({email:user.email})
    }catch(e){
        res.status(404).send({msg: "The Email you entered is not registered."})
    }
    
})

router.post('/fetchuser',async (req,res) => {
    try{
        const user = await User.findOne({email:req.body.email});
        if(!user){
            throw new Error()
        }
        res.send({fname: user.fname, lname:user.lname})
    }catch(e){
        res.status(404).send({msg: "Unable to fetch details. Please login again"});
    }
})

router.patch('/updateuser',async (req,res) => {
    try {
        const olduser = req.body.olduser;
        const newuser = req.body.newuser;
        
        var user = await User.findByCredentials(olduser.email,olduser.password);
        user.fname = newuser.fname;
        user.lname = newuser.lname;
        user.email = newuser.email;
        user.password = newuser.password;
    
        await user.save();
        res.status(201).send({msg: "Details have been successfully updated. Login Again"})

    }catch(e){
        console.log(e)
        res.status(404).send({msg: "Updating details Failed. Please try again."})
    }
})

router.patch('/forgotpassword',async (req,res) => {
    try{
        const user = await User.findOne({email:req.body.email})
        user.password = req.body.password;
        await user.save()
        res.send({msg: "Password Changed Succesfully. You can login now."})

    }catch(e){
        res.status(404).send({msg: "Email is not registered with us. Try again."})
    }
})

router.post('/deleteuser',async (req,res)=>{
    try {
        var user = await User.findByCredentials(req.body.email,req.body.password);
        const id = user._id
        await user.remove();
        await Item.deleteMany({owner: id})
        await Reminder.deleteMany({owner: id});
        res.status(201).send();
    }catch(e){
        console.log(e);
        res.status(501).send();
    }
})

module.exports = router
