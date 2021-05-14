const moment = require('moment')

async function onRequest(item){
    
    if(item.utilizationTime)
        delete item.utilizationTime
    if(item.utilizationQuantity)
        delete item.utilizationQuantity
    if(item.utilizationUnits)
        delete item.utilizationUnits
  
    var reqdate = moment(item.nextreqdate+' 23:59','YYYY-MM-DD HH:mm')
    var currentdate = moment(moment().format('YYYY-MM-DD'));
  
    var temp = reqdate.diff(currentdate,'days')
    
    item.totalstock = {}
    item.totalstock.daysleft = 0
    if(temp>0){
        item.totalstock.daysleft = temp;
    }
  
    if(item.totalstock.daysleft ==0){
        item.reminder = true
    }
  
    let amount = undefined;
    let units = undefined;
  
    if(item.units == 'kg' || item.units == 'lit'){
       amount = item.quantity*1000*item.stockcount
       units = item.units
       if(item.units == 'kg') units = 'gms'
       if(item.units == 'lit') units = 'ml'
    }
    else{
        amount=  item.quantity*item.stockcount
        units = item.units
    }
    item.totalstock.amount = amount
    item.totalstock.units = units
  
    await item.save()
}

async function onUpdateAddRequest(newstock,newquantity,newunits,item){
    if(newstock){
        if(item.units == 'kg' || item.units == 'lit'){
        item.totalstock.amount += newstock*item.quantity*1000
        item.stockcount = Math.ceil(item.totalstock.amount/(item.quantity*1000))
        }
        else{
        item.totalstock.amount += newstock*item.quantity
        item.stockcount = Math.ceil(item.totalstock.amount/item.quantity)
        }
    }

    if(newquantity){
        if(newunits == 'kg' || newunits == 'lit'){
            item.totalstock.amount += newquantity*1000
        }
        else{
            item.totalstock.amount += newquantity
        }

        if(item.units=='kg' || item.units == 'lit'){
            item.stockcount = Math.ceil(item.totalstock.amount/(item.quantity*1000))
        }else{
            item.stockcount = Math.ceil(item.totalstock.amount/(item.quantity))
        }
    }

    await item.save()
}

async function onUpdateRemoveRequest(newstock,newquantity,newunits,item){
    if(newstock){
        if(item.units == 'kg' || item.units == 'lit'){
            item.totalstock.amount -= newstock*item.quantity*1000
            if(item.totalstock.amount<=0)
                item.totalstock.amount = 0
            item.stockcount = Math.ceil(item.totalstock.amount/(item.quantity*1000))
        }
        else{
            item.totalstock.amount -= newstock*item.quantity
            if(item.totalstock.amount<=0)
                item.totalstock.amount = 0
            item.stockcount = Math.ceil(item.totalstock.amount/item.quantity)
        }
    }

    if(newquantity){
        if(newunits == 'kg' || newunits == 'lit'){
            item.totalstock.amount -= newquantity*1000
        }
        else{
            item.totalstock.amount -= newquantity
        }

        if(item.totalstock.amount<=0)
            item.totalstock.amount = 0

        if(item.units=='kg' || item.units == 'lit'){
            item.stockcount = Math.ceil(item.totalstock.amount/(item.quantity*1000))
        }else{
            item.stockcount = Math.ceil(item.totalstock.amount/(item.quantity))
        }
    }

    await item.save()
}

async function onAutomatic(item){

    item.totalstock = {}
    let dailyamount = undefined;
    let units = undefined;
  
    var currentdate = moment()
  
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
  
    let totalamount = undefined;

    if(item.units == 'kg' || item.units == 'lit'){
        totalamount = item.quantity*1000*item.stockcount
        
        units = item.units
        if(units == 'kg') units = 'gms'
        if(units == 'lit') units = 'ml'             
    
    }else{
        totalamount=  item.quantity*item.stockcount
        units = item.units    
    }
  
    item.totalstock.amount = totalamount
    item.totalstock.amount = Math.round(item.totalstock.amount*100)/100
    item.totalstock.units = units
    item.totalstock.daysleft = Math.floor(totalamount/dailyamount)
    if(item.totalstock.daysleft == 0 )
      item.reminder = true;
    else
      item.reminder = false;
  
    item.nextreqdate = currentdate.add(item.totalstock.daysleft,'days').format('YYYY-MM-DD')
    await item.save();
}
  
async function onUpdateAddAutomatic(newstock,newquantity,newunits,item) {
    if(newstock){
        newamount = undefined
        if(item.quantity=='kg' || item.quantity== 'lit')
            newamount = newstock*item.quantity*1000
        else
            newamount = newstock*item.quantity
        
        item.totalstock.amount += newamount
        item.totalstock.amount = Math.round(item.totalstock.amount*100)/100
        let dailyamount = undefined;
        let units = undefined;
    
        var currentdate = moment();
  
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

        if(item.units=='kg' || item.units == 'lit')
            item.stockcount = Math.ceil(item.totalstock.amount/(item.quantity*1000))
        else
            item.stockcount = Math.ceil(item.totalstock.amount/(item.quantity))


        item.totalstock.daysleft = Math.floor(item.totalstock.amount/dailyamount)
        if(item.totalstock.daysleft == 0 )
        item.reminder = true;
        else
        item.reminder = false;
  
        item.nextreqdate = currentdate.add(item.totalstock.daysleft,'days').format('YYYY-MM-DD')       
    }

    if(newquantity){
        if(newunits == 'kg' || newunits == 'lit'){
            item.totalstock.amount += newquantity*1000
        }
        else{
            item.totalstock.amount += newquantity
        }
        
        item.totalstock.amount = Math.round(item.totalstock.amount*100)/100

        if(item.units=='kg' || item.units == 'lit'){
            item.stockcount = Math.ceil(item.totalstock.amount/(item.quantity*1000))
        }else{
            item.stockcount = Math.ceil(item.totalstock.amount/(item.quantity))
        }

        let dailyamount = undefined;
        let units = undefined;
    
        var currentdate = moment()
        let reqdate = moment(item.nextreqdate)

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

        item.totalstock.daysleft = Math.floor(item.totalstock.amount/dailyamount)
        if(item.totalstock.daysleft == 0 )
        item.reminder = true;
        else
        item.reminder = false;
  
        item.nextreqdate = currentdate.add(item.totalstock.daysleft,'days').format('YYYY-MM-DD')
    }
    await item.save()
}

async function onUpdateRemoveAutomatic(newstock,newquantity,newunits,item) {
    if(newstock){
        newamount = undefined
        if(item.quantity=='kg' || item.quantity== 'lit')
            newamount = newstock*item.quantity*1000
        else
            newamount = newstock*item.quantity
        
        item.totalstock.amount -= newamount
        item.totalstock.amount = Math.round(item.totalstock.amount*100)/100

        if(item.totalstock.amount<=0){
            item.stockcount = 0
            item.totalstock.amount = 0
            item.totalstock.daysleft = 0
            item.nextreqdate = moment().format('YYYY-MM-DD')
            item.reminder = true;
        }
        else{
            
            let dailyamount = undefined;
            let units = undefined;
        
            var currentdate = moment()
            let reqdate = moment(item.nextreqdate)

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

            
        if(item.units=='kg' || item.units == 'lit')
            item.stockcount = Math.ceil(item.totalstock.amount/(item.quantity*1000))
        else
            item.stockcount = Math.ceil(item.totalstock.amount/(item.quantity))

            item.totalstock.daysleft = Math.floor(item.totalstock.amount/dailyamount)
            item.nextreqdate = currentdate.add(item.totalstock.daysleft,'days').format('YYYY-MM-DD')       
        
        }
    }

    if(newquantity){
        if(newunits == 'kg' || newunits == 'lit'){
            item.totalstock.amount -= newquantity*1000
        }
        else{
            item.totalstock.amount -= newquantity
        }
        
        item.totalstock.amount = Math.round(item.totalstock.amount*100)/100
        
        if(item.totalstock.amount<=0){
            item.stockcount = 0
            item.totalstock.amount = 0
            item.totalstock.daysleft = 0
            item.nextreqdate = moment().format('YYYY-MM-DD')
            item.reminder = true;
        }
        else{

            let dailyamount = undefined;
            let units = undefined;
        
            var currentdate = moment()
            let reqdate = moment(item.nextreqdate)

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

            
            if(item.units=='kg' || item.units == 'lit'){
                item.stockcount = Math.ceil(item.totalstock.amount/(item.quantity*1000))
            }else{
                item.stockcount = Math.ceil(item.totalstock.amount/(item.quantity))
            }

            item.totalstock.daysleft = Math.floor(item.totalstock.amount/dailyamount)
            if(item.totalstock.daysleft == 0 )
            item.reminder = true;
            else
            item.reminder = false;
    
            item.nextreqdate = currentdate.add(item.totalstock.daysleft,'days').format('YYYY-MM-DD')
        }
    
    }

    await item.save()
}

async function getNewStockCount(item,futuredate) {
    let dailyamount = undefined;
    let units = undefined;
    
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

    let daysrequired = moment(futuredate).diff(moment(moment().format('YYYY-MM-DD')),'days');
    let newstockcount = daysrequired*dailyamount    
    
    if(item.units=='kg' || item.units == 'lit'){
        newstockcount = Math.round(newstockcount/(item.quantity*1000))
    }else{
        newstockcount = Math.round(newstockcount/(item.quantity))
    }

    return newstockcount;
}

module.exports = {onRequest,onUpdateAddRequest,onUpdateRemoveRequest,onAutomatic,onUpdateAddAutomatic,onUpdateRemoveAutomatic,getNewStockCount}