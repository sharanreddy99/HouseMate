const CronJob = require('cron').CronJob;

var Item = require('../models/items')
const moment = require('moment')
const Reminder = require('../models/reminder')

async function fetchAllReminders() {
    var date = moment().format('YYYY-MM-DD')
    var hours = parseInt(moment().format('HH'))
    var minutes = parseInt(moment().format('mm'))

    const remindersAll = await Reminder.find({
        remtype: 'reminderonly',
        nextreqdate: date,
        nextreqtime: {hours,minutes}
    });
    return remindersAll;
}

async function updateReminders(reminder){
    reminder.isDisplayed = true;
    await reminder.save();

    var title = reminder.title
    if(reminder.description && reminder.description.length>0){
        title = title + ' | '+reminder.description
    }

    var daysgap = reminder.daysgap
    var customdays = reminder.customdays
    var timegap = reminder.timegap
    var customtime = reminder.customtime

    var nextreqdate = reminder.nextreqdate;
    var nextreqtime = reminder.nextreqtime;
    
    if(daysgap!=undefined && daysgap>=0){
        if(daysgap==0){ //If days gap is 0
            if(timegap.hours==0 && timegap.minutes==0){
                //customtime is present
                nextreqtime = customtime.find(function(time){
                    return (time.hours>=nextreqtime.hours && time.minutes>nextreqtime.minutes) || (time.hours>nextreqtime.hours);
                });

                if(!nextreqtime){
                    nextreqdate = moment().add(1,'days').format('YYYY-MM-DD');
                    nextreqtime = {}
                    nextreqtime.hours = customtime[0].hours
                    nextreqtime.minutes = customtime[0].minutes
                }
            }else{
                //if time interval is present
                
                temp = moment(nextreqdate+'-'+nextreqtime.hours+'-'+nextreqtime.minutes,'YYYY-MM-DD-HH-mm').add(timegap.hours,'hours').add(timegap.minutes,'minutes')
                nextreqdate = temp.format('YYYY-MM-DD')
                nextreqtime = {}
                nextreqtime.hours = temp.format('HH');
                nextreqtime.minutes = temp.format('mm');
            }
        }else{
            //if days gap is greater than 0
            if(timegap.hours==0 && timegap.minutes==0){
                nextreqtime = customtime.find(function(time){
                    return (time.hours>=nextreqtime.hours && time.minutes>nextreqtime.minutes) || (time.hours>nextreqtime.hours);
                });

                if(!nextreqtime){
                    nextreqdate = moment(nextreqdate).add(daysgap,'days').format('YYYY-MM-DD')
                    //always choose the first time
                    nextreqtime = {}
                    nextreqtime.hours = customtime[0].hours
                    nextreqtime.minutes = customtime[0].minutes
                }
            }else{
                //choose the specified time interval adding it to current time 
                temp = moment(nextreqdate+'-'+nextreqtime.hours+'-'+nextreqtime.minutes,'YYYY-MM-DD-HH-mm').add(timegap.hours,'hours').add(timegap.minutes,'minutes')
                nextreqdate = temp.format('YYYY-MM-DD')
                nextreqtime = {}
                nextreqtime.hours = temp.format('HH');
                nextreqtime.minutes = temp.format('mm');
            }
        }
    }
    else{
        //custom days are available
        
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
                if( nextreqdate != temp.format('YYYY-MM-DD')){
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

    const newReminder = new Reminder({
        newtitle: title + ' | '+nextreqdate + " "+nextreqtimestring.hours+":"+nextreqtimestring.minutes,
        title: reminder.title,
        description: reminder.description,
        priority: reminder.priority,
        daysgap: reminder.daysgap,
        customdays: reminder.customdays,
        timegap: reminder.timegap,
        customtime: reminder.customtime,
        nextreqdate,
        nextreqtime,
        isDisplayed: false,
        owner: reminder.owner
    })
    
    await newReminder.save();
}

//once a day at 12:05am
var autoComputeItemRule = new CronJob('0 5 12 1/1 * *',async function (){
    const unchangedAllItems = await Item.find({isDisabled: true, notify: "auto"})
    
    for(let i=0;i<unchangedAllItems.length;i++){
        unchangedAllItems[i].nextreqdate = moment(unchangedAllItems[i].nextreqdate).add(1,'days').format('YYYY-MM-DD');
        await unchangedAllItems[i].save();
    }
    
    const allItems = await Item.find({isDisabled: false, notify: "auto"})
    
    for(var i=0;i<allItems.length;i++){
        var item = allItems[i]

        var dailyamount = undefined;
        var units = undefined;
        if(item.utilizationUnits == 'kg' || item.utilizationUnits == 'lit'){
            dailyamount = (item.utilizationQuantity*1000)/item.utilizationTime
            units = item.utilizationUnits
            if(item.utilizationUnits == 'kg') units = 'gms'
            if(item.utilizationUnits == 'lit') units = 'ml'
        }
        else{
            dailyamount = (item.utilizationQuantity)/item.utilizationTime
            units = item.utilizationUnits
        }

        item.totalstock.amount -= dailyamount
        item.totalstock.amount = Math.round(item.totalstock.amount*100)/100
        if(item.totalstock.amount<0){
            item.totalstock.amount = 0
        }
        
        if(item.units=='kg' || item.units == 'lit')
            item.stockcount = Math.ceil(item.totalstock.amount/(item.quantity*1000))
        else
            item.stockcount = Math.ceil(item.totalstock.amount/(item.quantity))
    
        item.totalstock.daysleft -= 1
        if(item.totalstock.daysleft <0)
            item.totalstock.daysleft = 0
        if(item.totalstock.daysleft == 0 )
            item.reminder = true;
        else
            item.reminder = false;

        item.nextreqdate = moment().add(item.totalstock.daysleft,'days').format('YYYY-MM-DD');

        await item.save();
    }
},null,true);

//once a day at 12:10 am
var calculateRemindersForItemsRule = new CronJob('0 10 12 1/1 * *',async function (){
 
  var date = moment().format('YYYY-MM-DD')
  
  const allItems = await Item.find({nextreqdate: {$lte: date}});
  for(var i=0;i<allItems.length;i++){
    await Reminder.deleteMany({owner: allItems[i].owner,title: allItems[i].category+" | "+allItems[i].name+" | "+allItems[i].quantity+allItems[i].units,remtype: 'item'})
  }

  for(var i=0;i<allItems.length;i++){  
    reminder = new Reminder({
        newtitle: allItems[i].category+" | "+allItems[i].name+" | "+allItems[i].quantity+allItems[i].units+" | "+allItems[i].nextreqdate,
        title: allItems[i].category+" | "+allItems[i].name+" | "+allItems[i].quantity+allItems[i].units,
        description: allItems[i].description,
        priority: "high",
        daysgap: 0,
        customdays: [],
        timegap: [],
        customtime: [],
        nextreqdate: date,  
        nextreqtime: {
            hours: 9,
            minutes: 0
        },
        remtype: 'item',
        isDisplayed: true,
        owner: allItems[i].owner
    })
    await reminder.save();
  }
},null,true);

//every minute
var calculateAndUpdateRemindersRule = new CronJob('0 0/1 * 1/1 * *', async function() {
    const remindersAll = await fetchAllReminders();
    for(var i=0;i<remindersAll.length;i++){
        try{
            await updateReminders(remindersAll[i]);
        }
        catch(e){
            console.log(e);
        }
    }
     
},null,true)

//everyday at 12:15 am
var sendEmailReminderRule = new CronJob('0 15 12 1/1 * *',async function (){
    const remindersAll = await Reminder.find({isDisplayed: true, priority: 'high'})
    var emailtoreminder = {}

    for(var i=0;i<remindersAll.length;i++){
        await remindersAll[i].populate('owner').execPopulate()
        emailtoreminder[''+remindersAll[i].owner.email] = []    
    }

    for(var i=0;i<remindersAll.length;i++){
        emailtoreminder[''+remindersAll[i].owner.email].push(remindersAll[i].newtitle)
    }
    emails = Object.keys(emailtoreminder);
    
    for(var i=0;i<emails.length;i++){
        var toAddress = emails[i];
        console.log(toAddress);
        reminderlist = ''
        for(var j=0;j<emailtoreminder[''+emails[i]].length;j++){
            reminderlist += (j+1)+') '+emailtoreminder[''+emails[i]][j]+'<br/>';
        }
            
        try{
            
            htmltosend = `<!doctype html>
            <html lang="en">
              <head>
                <title>Title</title>
                
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
            
                
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
              </head>
              <body style="background-color: #5CDB95">
                  
                
                <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
                <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
            
                
                <div class="container-fluid">
                    <div class="row m-4" style="background-color: #EDF5E1; color: #05386B">
                        <div class="col-4">            
                            <h1> Reminders List: </h1>
                            <h3>`+reminderlist+`</h3>
                        </div>
                    </div>
                </div>
              </body>
            </html>`
            const transporter = require('../miscellaneous/email')
                
            const mailOptions = {
                from: 'sharanreddyfake@gmail.com',
                to: toAddress,
                subject: 'Reminders list',
                html: htmltosend   
            };
            
            transporter.sendMail(mailOptions, function(err,data) {
                if(err){
                    console.log(err)
                    return res.status(500).send({msg: "Unable to generate OTP. Please try again."});
                }
                res.status(201).send({otp})
            });
        }
        catch(e){
            console.log(e)
            res.status(500).send({msg: "Unable to send reminders to email. Please try again."});
        } 
    }         
},null,true)
