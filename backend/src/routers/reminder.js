const express = require('express')
const router = new express.Router()

const auth = require('../middleware/userauth')
const Reminder = require('../models/reminder')
const moment = require('moment')

router.post('/addreminder', auth, async (req,res)=> {
    try{

       req.body.owner = req.body.userid;
        
        let daysgap = undefined
        let customdays = []
        let timegap = {
            hours: 0,
            minutes: 0
        }
        let customtime = []

        if(req.body.reminderSettings.daysgap!=undefined && req.body.reminderSettings.daysgap >=0)
            daysgap = parseInt(req.body.reminderSettings.daysgap)
        
        customdays = req.body.reminderSettings.daysselected.map((obj)=>obj.text);

        if(req.body.reminderSettings.timegap){
            timegap.hours = parseInt(req.body.reminderSettings.timegap.substring(0,2))
            timegap.minutes = parseInt(req.body.reminderSettings.timegap.substring(3))
        }

        customtime = req.body.reminderSettings.timeselected.map((obj)=>obj.text);

        for(let i=0;i<customtime.length;i++){
            customtime[i] = {
                hours: parseInt(customtime[i].substring(0,2)),
                minutes: parseInt(customtime[i].substring(3))    
            }
        }

        customdays.sort();
        customtime.sort(function(a,b){
            if(b.hours!=a.hours)
                return a.hours-b.hours
            else
                return a.minutes-b.minutes
        });

        let nextreqdate = undefined;
        let nextreqtime = {
            hours: 0,
            minutes: 0
        };
        
        if(daysgap!=undefined && daysgap>=0){
            if(daysgap==0){ //If days gap is 0
                nextreqdate = moment().format('YYYY-MM-DD');
                if(timegap.hours==0 && timegap.minutes==0){
                    //customtime is present
                    nextreqtime = customtime.find(function(time){
                        return (time.hours>=moment().format('hh') && time.minutes>moment().format('mm')) || (time.hours>moment().format('hh'));
                    });

                    if(!nextreqtime) //if no custom time greater than current time is available , add a day
                    {
                        nextreqdate = moment().add(1,'days').format('YYYY-MM-DD');
                        nextreqtime = {}
                        nextreqtime.hours = customtime[0].hours
                        nextreqtime.minutes = customtime[0].minutes
                    }
                    
                }else{
                    //if time interval is present
                    temp = moment().add(timegap.hours,'hours').add(timegap.minutes,'minutes')
                    nextreqdate = temp.format('YYYY-MM-DD')
                    nextreqtime = {}
                    nextreqtime.hours = temp.format('HH');
                    nextreqtime.minutes = temp.format('mm');
                }
            }else{
                //if days gap is greater than 0
                nextreqdate = moment().add(daysgap,'days').format('YYYY-MM-DD');
                if(timegap.hours==0 && timegap.minutes==0){
                    //always choose the first time
                    nextreqtime = {}
                    nextreqtime.hours = customtime[0].hours
                    nextreqtime.minutes = customtime[0].minutes
                }else{
                    //choose the specified time interval adding it to 12:00am
                    temp = moment(nextreqdate).add(timegap.hours,'hours').add(timegap.minutes,'minutes')
                    nextreqtime = {}
                    nextreqtime.hours = temp.format('HH');
                    nextreqtime.minutes = temp.format('mm');
                }
            }
        }
        else{
            //custom days are available
            nextreqdate = customdays.find((date) => {
                return date.substring(5)>=moment().format('MM-DD');
            });
            
            //if custom date is available
            if(timegap.hours==0 && timegap.minutes==0){
                //if custom date and time available
                if(nextreqdate==moment().format('YYYY-MM-DD')){
                    nextreqtime = customtime.find(function(time){
                        return (time.hours>=moment().format('hh') && time.minutes>moment().format('mm')) || (time.hours>moment().format('hh'));
                    });
                }else{
                    nextreqtime = customtime[0];
                }

                if(!nextreqtime)
                {
                    //custom date available but custom time is past search for next custom date
                    nextreqdate = customdays.find((date) => {
                        return date.substring(5)>moment().format('MM-DD');
                    });
                    
                    if(!nextreqdate){
                        //after searching if custom date not available goto next year
                        nextreqdate= moment().add(1,'years').format('YYYY')+customdays[0].substring(4);
                        if(timegap.hours==0 && timegap.minutes==0){
                            //custom time available choose first one
                            nextreqtime = {}
                            nextreqtime.hours = customtime[0].hours
                            nextreqtime.minutes = customtime[0].minutes
                        }else{
                            //time interval present add it to 12:00am
                            temp = moment(nextreqdate).add(timegap.hours,'hours').add(timegap.minutes,'minutes')
                            nextreqtime = {}
                            nextreqtime.hours = temp.format('HH');
                            nextreqtime.minutes = temp.format('mm');
                        }
                    }else{
                        //after searching custom date available
                        if(timegap.hours==0 && timegap.minutes==0){
                            //custom time available choose first one
                            nextreqtime = {}
                            nextreqtime.hours = customtime[0].hours
                            nextreqtime.minutes = customtime[0].minutes
                        }else{
                            //time interval present add it to 12:00am
                            temp = moment(nextreqdate).add(timegap.hours,'hours').add(timegap.minutes,'minutes')
                            nextreqtime = {}
                            nextreqtime.hours = temp.format('HH');
                            nextreqtime.minutes = temp.format('mm');
                        }  
                    }
                }
            }else{ 
                if(nextreqdate == moment().format('YYYY-MM-DD')){
                    var temp = moment(nextreqdate+"-"+moment().format('HH')+"-"+moment().format('mm'),'YYYY-MM-DD-HH-mm').add(timegap.hours,'hours').add(timegap.minutes,'minutes');
                    if(nextreqdate != temp.format('YYYY-MM-DD')){
                        nextreqdate = customdays.find((date) => {
                            return date.substring(5)>=temp.format('MM-DD');
                        });

                        if(!nextreqdate){
                            nextreqdate = moment().add(1,'years').format('YYYY')+customdays[0].substring(4);
                        }
    
                        nextreqtime = {}
                        nextreqtime.hours = parseInt(timegap.hours)
                        nextreqtime.minutes = parseInt(timegap.minutes)    
                    }else{    
                        nextreqtime = {}
                        nextreqtime.hours = parseInt(temp.format('HH'))
                        nextreqtime.minutes = parseInt(temp.format('mm'))
                    }
                }else{
                    var temp = moment(nextreqdate).add(timegap.hours,'hours').add(timegap.minutes,'minutes');
                    nextreqtime = {}
                    nextreqtime.hours = parseInt(temp.format('HH'))
                    nextreqtime.minutes = parseInt(temp.format('mm'))    
                }
            }
        }

        let title = req.body.reminderSettings.title
        
        if(req.body.reminderSettings.description && req.body.reminderSettings.description.length>0){
            title = title + ' | '+req.body.reminderSettings.description
        }

        nextreqtimestring = {}

        if((''+nextreqtime.hours).length==1){
            nextreqtimestring.hours = '0'+nextreqtime.hours
        }else{
            nextreqtimestring.hours = nextreqtime.hours
        }
        
        if((''+nextreqtime.minutes).length==1){
            nextreqtimestring.minutes = '0'+nextreqtime.minutes
        }else{
            nextreqtimestring.minutes = nextreqtime.minutes
        }

        const reminder = new Reminder({
            newtitle: title + ' | '+nextreqdate + " "+nextreqtimestring.hours+":"+nextreqtimestring.minutes,
            title: req.body.reminderSettings.title,
            description: req.body.reminderSettings.description === undefined? '' : req.body.reminderSettings.description,
            priority: req.body.reminderSettings.priority,
            daysgap,
            customdays,
            timegap,
            customtime,
            nextreqdate,
            nextreqtime,
            owner: req.body.owner
        })
        await reminder.save();
        res.send("");
        
    }catch(e){
        console.log(e)
        res.status(500).send({msg: "Unable to add reminder. Please try again."});
    }
})

router.post('/getallreminder',auth, async(req,res)=> {
    try{
        req.body.owner = req.body.userid
        const reminders = await Reminder.find({owner:req.body.owner,isDisplayed: true})
        var newreminders = []
        for(let i=0;i<reminders.length;i++){
            newreminders[i] = {}
            newreminders[i]._id = reminders[i]._id;
            newreminders[i].newtitle = reminders[i].newtitle;
            newreminders[i].title = reminders[i].title;
        }
        res.status(201).send(newreminders);

    }catch(e){
        console.log(e)
        res.status(501).send();
    }
});

router.post('/deleteonereminder', auth, async (req,res)=> {
    try{
        req.body.owner = req.body.userid;
        const reminder = await Reminder.findOne({owner: req.body.owner, _id: req.body._id})
        await reminder.remove();
        res.send();
    }catch(e){
        console.log(e);
        res.status(501).send();
    }
});


router.post('/deleteallreminders', auth, async (req,res)=> {
    try{
        req.body.owner = req.body.userid;
        const allReminders = await Reminder.find({owner: req.body.owner, title: req.body.title})
        for(let i=0;i<allReminders.length;i++){
            await allReminders[i].remove();
        }
        res.send();
    }catch(e){
        console.log(e);
        res.status(501).send();
    }
});
module.exports = router;
