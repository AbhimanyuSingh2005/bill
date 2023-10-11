const express = require('express');
const checkAuthenticated = require('./auth').checkAuthenticated;
const mongoose = require('mongoose');

const User = require('../model/userSchema');
const router = express.Router();
const date = new Date();
function getDate (){
    const options = {
        day : "numeric",
        month : "numeric",
        year : "numeric"
    }
    return date.toLocaleDateString("en-US",options);
}

router.get('/bill',checkAuthenticated,async (req, res) => {
    try{
        const today = getDate();
        const user = await User.findById(req.user.id);
        const credit = user.transaction.filter((item)=>item.debit===false);
        const debit = user.transaction.filter((item)=>item.debit===true);
        res.json({'amount':user.amount,'transaction':user.transaction,'credit':credit,'debit':debit,'message':"succesfully welcome to bill"}).status(200);
    }catch(err){
        console.log(err);
    }
});

router.post('/update',checkAuthenticated,async(req,res)=>{
    try{
        const user = await User.findById(req.user.id);
        const update = req.body;
        console.log(update);
        update.debit = (Number)(update.debit);
        update.date = getDate();
        var amount = user.amount;
        if(update.debit){
            amount = user.amount - (Number)(update.amount);
            console.log(amount);
        }else{
            amount = user.amount + (Number)(update.amount);
            console.log(amount);
        }
        await User.findByIdAndUpdate(req.user.id,{amount:amount,$push:{transaction:update}});
        res.json({'message':"succesfully registered the update amount"}).status(200);
    }catch(err){
        console.log(err);
    }
});

module.exports = router;
