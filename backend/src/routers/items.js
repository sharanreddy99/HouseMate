const express = require('express')
const moment = require('moment')
const router = new express.Router()
const Item = require('../models/items')
const auth = require('../middleware/userauth')
const Reminder = require('../models/reminder');
var fs = require('fs')

const itemMethods = require('../miscellaneous/itemMethods')

router.post('/addItem', auth, async (req,res) => {
  
  try{
    req.body.itemSettings.owner = req.body.userid;
    const tempitem = await Item.findOne({owner:req.body.itemSettings.owner,name: req.body.itemSettings.name});
    if(tempitem)
      throw new Error();

    const item = new Item(req.body.itemSettings)
    item.isDisabled = req.body.isDisabled
    
    if(item.notify=="request"){
        await itemMethods.onRequest(item)
    }
    else{
      await itemMethods.onAutomatic(item)
    }

    var reminderitem = await Item.findOne({owner: req.body.itemSettings.owner, category: req.body.itemSettings.category,name: req.body.itemSettings.name,nextreqdate: {$eq: moment().format('YYYY-MM-DD')}});
    
    if(reminderitem){
      reminder = new Reminder({
        newtitle: reminderitem.category+" | "+reminderitem.name+" | "+reminderitem.quantity+reminderitem.units+" | "+reminderitem.nextreqdate,
        title: reminderitem.category+" | "+reminderitem.name+" | "+reminderitem.quantity+reminderitem.units,
        description: reminderitem.description,
        priority: "high",
        daysgap: 0,
        customdays: [],
        timegap: [],
        customtime: [],
        nextreqdate: reminderitem.nextreqdate,
        nextreqtime: {
          hours: 9,
          minutes: 0
        },
        remtype: 'item',
        isDisplayed: true,
        owner: reminderitem.owner
      })
      await reminder.save();
    }
    res.send({item})
  
  }catch(e){
    console.log(e)
    res.status(500).send({msg: "Unable to add item , check whether the item is duplicated"})
  }
})

router.patch('/updateItem', auth, async (req,res) => {
  try{
    req.body.itemSettings.owner = req.body.userid;

    if(req.body.oldItemSettings.category != req.body.oldItemSettings.category || req.body.oldItemSettings.name != req.body.itemSettings.name){
      tempqueryitem = {category: req.body.itemSettings.category,name: req.body.itemSettings.name}
      const tempitem = await Item.findOne(tempqueryitem);
      if(tempitem)
        throw new Error('Duplicate Item Found');
    }
    
    var item = await Item.findOne({owner: req.body.itemSettings.owner, category: req.body.oldItemSettings.category,name: req.body.oldItemSettings.name}); 
    
    const reminder = await Reminder.findOne({owner: req.body.itemSettings.owner,title: item.category+" | "+item.name+" | "+item.quantity+item.units, remtype: 'item'})
    keys = Object.keys(req.body.itemSettings);
    for(var i=0;i<keys.length;i++){
      item[keys[i]] = req.body.itemSettings[keys[i]];
    }

    if(item.notify=="request"){
      await itemMethods.onRequest(item)
    }
    else{
      await itemMethods.onAutomatic(item)
    }

    var item = await Item.findOne({owner: req.body.itemSettings.owner, category: req.body.itemSettings.category, name: req.body.itemSettings.name});
    if(reminder){
      reminder.newtitle = item.category+" | "+item.name+" | "+item.quantity+item.units+" | "+item.nextreqdate;
      reminder.title = item.category+" | "+item.name+" | "+item.quantity+item.units;
      reminder.description =  item.description;
      reminder.nextreqdate =  item.nextreqdate;
      reminder.isDisplayed = true;
      reminder.remtype= 'item';
      await reminder.save();  
      if(reminder.nextreqdate>moment().format('YYYY-MM-DD'))
        await reminder.remove();
    }else{
      if(item.nextreqdate == moment().format('YYYY-MM-DD')){
        const newreminder = new Reminder({
          newtitle: item.category+" | "+item.name+" | "+item.quantity+item.units+" | "+item.nextreqdate,
          title: item.category+" | "+item.name+" | "+item.quantity+item.units,
          description: item.description,
          priority: 'high',
          daysgap: 0,
          customdays: [],
          timegap: [],
          customtime: [],
          nextreqdate: item.nextreqdate,
          nextreqtime: {
            hours: 9,
            minutes: 0
          },
          remtype: 'item',
          isDisplayed: true,
          owner: item.owner
        })
      await newreminder.save();
      }
    }
    res.status(201).send({category: item.category,name: item.name})
    
  }catch(e){
    console.log(e);
    res.status(500).send({msg: "Unable to add item , check whether the item is duplicated"})
  }
})

router.post('/refillItem',auth,async (req,res)=> {
  try{
    req.body.itemSettings.owner = req.body.userid;
    const item = await Item.findOne({owner: req.body.itemSettings.owner, category: req.body.itemSettings.category,name: req.body.itemSettings.name});

    if(item.notify=="request")
      await itemMethods.onUpdateAddRequest(req.body.newstockcount,req.body.newquantity,req.body.newunits,item)
    else
      await itemMethods.onUpdateAddAutomatic(req.body.newstockcount,req.body.newquantity,req.body.newunits,item)

      var reminderitem = await Item.findOne({owner: req.body.itemSettings.owner, category: req.body.itemSettings.category,name: req.body.itemSettings.name,quantity: req.body.itemSettings.quantity, units: req.body.itemSettings.units});
      await Reminder.deleteMany({owner: req.body.itemSettings.owner, title: reminderitem.category+" | "+reminderitem.name+" | "+reminderitem.quantity+reminderitem.units,remtype: 'item'});

      if(reminderitem.nextreqdate == moment().format('YYYY-MM-DD')){
        reminder = new Reminder({
          newtitle: reminderitem.category+" | "+reminderitem.name+" | "+reminderitem.quantity+reminderitem.units+" | "+reminderitem.nextreqdate,
          title: reminderitem.category+" | "+reminderitem.name+" | "+reminderitem.quantity+reminderitem.units,
          description: reminderitem.description,
          priority: "high",
          daysgap: 0,
          customdays: [],
          timegap: [],
          customtime: [],
          nextreqdate: reminderitem.nextreqdate,
          nextreqtime: {
            hours: 9,
            minutes: 0
          },
          remtype: 'item',
          isDisplayed: true,
          owner: reminderitem.owner
        })
        
        await reminder.save();
      }
    res.status(201).send()
  }catch(e){
    console.log(e)
    res.status(500).send({msg: "Unable to refill Item."});
  }
})

router.post('/removeItem',auth,async (req,res)=> {
  try{
    req.body.itemSettings.owner = req.body.userid;
    const item = await Item.findOne({owner: req.body.itemSettings.owner, category: req.body.itemSettings.category,name: req.body.itemSettings.name});
    
    if(item.notify=="request")
      await itemMethods.onUpdateRemoveRequest(req.body.newstockcount,req.body.newquantity,req.body.newunits,item)
    else
      await itemMethods.onUpdateRemoveAutomatic(req.body.newstockcount,req.body.newquantity,req.body.newunits,item)

      var reminderitem = await Item.findOne({owner: req.body.itemSettings.owner, category: req.body.itemSettings.category, name: req.body.itemSettings.name, nextreqdate: moment().format('YYYY-MM-DD')});
      if(reminderitem){
        reminder = new Reminder({
          newtitle: reminderitem.category+" | "+reminderitem.name+" | "+reminderitem.quantity+reminderitem.units+" | "+reminderitem.nextreqdate,
          title: reminderitem.category+" | "+reminderitem.name+" | "+reminderitem.quantity+reminderitem.units,
          description: reminderitem.description,
          priority: "high",
          daysgap: 0,
          customdays: [],
          timegap: [],
          customtime: [],
          nextreqdate: reminderitem.nextreqdate,
          nextreqtime: {
            hours: 9,
            minutes: 0
          },
          remtype: 'item',
          isDisplayed: true,
          owner: req.body.itemSettings.owner
        })
        await Reminder.deleteOne({owner: req.body.itemSettings.owner, title: reminderitem.category+" | "+reminderitem.name+" | "+reminderitem.quantity+reminderitem.units,remtype: 'item'})
        await reminder.save();
      }

      res.status(201).send()
  }catch(e){
    console.log(e)
    res.status(500).send({msg: "Unable to remove Item. Please try again."});
    
  }
})

router.post('/deleteItem', auth, async (req,res) => {
  try{
    req.body.itemSettings.owner = req.body.userid;
    const item = await Item.findOne({category: req.body.itemSettings.category, name: req.body.itemSettings.name, owner: req.body.itemSettings.owner})
    await Reminder.deleteMany({owner: req.body.itemSettings.owner, newtitle: item.category+" | "+item.name+" | "+item.quantity+item.units+" | "+item.nextreqdate,remtype: 'item'});

    await item.remove();
    res.send();
    
  }catch(e){
    console.log(e)
    res.status(500).send({msg: "Unable to delete item."})
  }
})

router.post('/getCategories', auth, async (req,res) => {
  try{
    req.body.owner = req.body.userid;
    var category = await Item.find({owner: req.body.owner},{category:1})
    
    var tempcategory = {}

    for(var i=0;i<category.length;i++){
      tempcategory[category[i].category] = category[i];
    }

    var i=0;
    var newcategory = []

    for(const itemind in tempcategory){
      newcategory[i] = {}
      newcategory[i].id = i+1
      newcategory[i].text = tempcategory[itemind].category;
      i+=1
    }

    res.send(newcategory)

  }catch(e){
    res.status(500).send({msg: "Server down , unable to fetch details."})
  }
})

router.post('/getItems', auth, async (req,res) => {
  try{
    req.body.owner = req.body.userid;
    
    var item = await Item.find({owner: req.body.owner, category: req.body.category},{name:1})
    var newitem = []
    for(var i=0;i<item.length;i++){
      newitem[i] = {};
      newitem[i].id = i+1;
      newitem[i].text = item[i].name;
    }
    res.send(newitem)
  }catch(e){
    res.status(500).send({msg: "Server down , unable to fetch details."})
  }
})

router.post('/getCurrentItem', auth, async (req,res) => {
  try{
    req.body.owner = req.body.userid;
    var item = await Item.findOne({owner: req.body.owner, category: req.body.category,name: req.body.name})
    res.send(item)
  }catch(e){
    res.status(500).send({msg: "Server down , unable to fetch details."})
  }
})

router.post('/getDisabled',auth,async (req,res) => {
  try{
    req.body.owner = req.body.userid;
    const item = await Item.findOne({owner: req.body.owner});
    let flag = false
    if(item){
      flag = item.isDisabled;
    }
    
    res.status(201).send({checked:flag})
  }catch(e){
    console.log(e)
    res.status(500).send({msg: "Unable to fetch disabled status."});
    
  }
})

router.post('/getestimatedstock', auth, async (req,res) => {
  try{
    req.body.owner = req.body.userid
    var reqdurationdate = moment() 
    if(req.body.duration){
      reqdurationdate = reqdurationdate.add(req.body.duration,'days').format('YYYY-MM-DD')
    }
    else if(req.body.dateduration){
      reqdurationdate = moment(req.body.dateduration).format('YYYY-MM-DD')
    }

    const allItems = await Item.find({owner: req.body.owner,nextreqdate: {$lte: reqdurationdate}});
    
    var estimatedstock = []
    for(var i=0;i<allItems.length;i++){
      estimatedstock[i] = {}
      estimatedstock[i].id = i;
      estimatedstock[i].text = allItems[i].name; 
    }
    res.status(201).send({estimatedstock})

  }catch(e){
    console.log(e)
    res.status(500).send({msg: "Unable to fetch estimated stock. Please try again."});
  }
})

router.post('/getcompleteestimatedstock', auth, async (req,res) => {
  try{
    req.body.owner = req.body.userid
    var reqdurationdate = moment() 
    if(req.body.duration){
      reqdurationdate = reqdurationdate.add(req.body.duration,'days').format('YYYY-MM-DD')
    }
    else if(req.body.dateduration){
      reqdurationdate = moment(req.body.dateduration).format('YYYY-MM-DD')
    }

    const allItems = await Item.find({owner: req.body.owner,nextreqdate: {$lte: reqdurationdate}});
    
    var estimatedstock = []
    for(var i=0;i<allItems.length;i++){
      estimatedstock[i] = {}
      estimatedstock[i].id = i;
      estimatedstock[i].text = allItems[i].name;
      estimatedstock[i].category = allItems[i].category;
      estimatedstock[i].name = estimatedstock[i].text;
      estimatedstock[i].nextreqdate = allItems[i].nextreqdate;
      estimatedstock[i].currentstockcount = allItems[i].stockcount;
      if(allItems[i].notify=="auto"){
        estimatedstock[i].newstockcount = await itemMethods.getNewStockCount(allItems[i],reqdurationdate);
        estimatedstock[i].price = estimatedstock[i].newstockcount*allItems[i].price;
      }
      else{
        estimatedstock[i].newstockcount = 'On Request';
        estimatedstock[i].price = undefined;
      }
    }
    res.status(201).send({estimatedstock})

  }catch(e){
    console.log(e)
    res.status(500).send({msg: "Unable to fetch complete estimated stock. Please try again."});
  }
})

router.post('/setDisabled',auth,async (req,res) => {
  try{
    req.body.owner = req.body.userid;
    var allItems = await Item.find({owner: req.body.owner});
    for(var i=0;i<allItems.length;i++){
      allItems[i].isDisabled = req.body.isDisabled;
      await allItems[i].save();
    }

    var allItems = await Item.find({owner: req.body.owner});
    res.status(201).send()

  }catch(e){
    console.log(e)
    res.status(500).send({msg: "Unable to set disabled state. Please try again."});
  }
})

router.post('/getallitems', auth, async (req,res) => {

  try {

    req.body.owner = req.body.userid;
    var category = await Item.find({owner: req.body.owner},{category:1})
    
    var tempcategory = {}

    for(var i=0;i<category.length;i++){
      tempcategory[category[i].category] = category[i];
    }

    var i=0;
    var newcategory = []

    for(const itemind in tempcategory){
      newcategory[i] = {}
      newcategory[i].id = i+1
      newcategory[i].text = tempcategory[itemind].category;
      i+=1
    }    
    
    const allItems = await Item.find({owner: req.body.owner},{category:1, name: 1, stockcount: 1,nextreqdate: 1});
    var estimatedstock = []
    for(let i=0;i<allItems.length;i++){
      estimatedstock[i] = {};
      estimatedstock[i].category = allItems[i].category;
      estimatedstock[i].name = allItems[i].name;
      estimatedstock[i].stockcount = allItems[i].stockcount;
      estimatedstock[i].nextreqdate = allItems[i].nextreqdate;
    }

    res.status(201).send({selectdata: newcategory,estimatedstock});

  }
  catch(e) {
    console.log(e);
    res.status(500).send({msg: "Unable to get all items. Please try again."});
  }
})

router.post('/getitemsforsummary',auth, async (req,res) => {
  try{
    req.body.owner = req.body.userid;
    const estimatedstock = await Item.find({owner:req.body.owner,category: req.body.category},{category: 1, name: 1, stockcount: 1, nextreqdate: 1})
    res.status(201).send({estimatedstock});
  }catch(e){
    console.log(e);
    res.status(500).send({msg: "Unable to items for summary. Please try again."});
  }
})

module.exports = router
