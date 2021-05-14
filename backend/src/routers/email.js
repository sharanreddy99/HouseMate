const express = require('express')
const crs = require('crypto-random-string')
const handlebars = require('handlebars')
const fs = require('fs')
const path = require('path')

const router  = new express.Router()

router.post('/generateotp',(req,res) => {
    
    const otp = crs({length:8,type: 'numeric'});
    const toAddress = req.body.email;
    
    try{
        const transporter = require('../miscellaneous/email')
        fs.readFile(path.join(__dirname,'../miscellaneous/otptemplate.html'), {encoding: 'utf-8'}, function (err, html) {

            const template = handlebars.compile(html);
            var replacements = {otp};
            var htmltosend = template(replacements);

            const mailOptions = {
                from: 'sharanreddyfake@gmail.com',
                to: toAddress,
                subject: 'Generating OTP',
                html: htmltosend   
            };

            transporter.sendMail(mailOptions, function(err,data) {
                if(err){
                    console.log(err)
                    return res.status(500).send({msg: "Unable to generate OTP. Please try again."});
                }
                res.status(201).send({otp})
            });
        });
    }catch(e){
        console.log(e)
        res.status(500).send({msg: "Unable to generate OTP. Please try again."});
    }
})

module.exports = router
