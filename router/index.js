const express = require('express');
const checkAuthenticated = require('./auth').checkAuthenticated;
const mongoose = require('mongoose');

const User = require('../model/userSchema');
const router = express.Router();
const date = new Date();
function getDate (){
    const options = {
        day : "numeric",
        month : "short",
        year : "numeric"
    }
    return date.toLocaleDateString("en-US",options);
}

router.get('/bill',checkAuthenticated,async (req, res) => {
    try{
        const today = getDate();
        const user = await User.findById(req.user.id);
        res.json({'credit':user.credits,'debits':user.debits,'message':"succesfully welcome to bill"}).status(200);
    }catch(err){
        console.log(err);
    }
});

router.post('/credit',checkAuthenticated,async(req,res)=>{
    try{
        const user = await User.findById(req.user.id);
        const credit = req.body;
        credit.date = getDate();
        const amount = user.amount + (Number)(credit.amount);
        await User.findByIdAndUpdate(req.user.id,{amount:amount,$push:{credits:credit}});
        res.json({'message':"succesfully registered the credit amount"}).status(200);
    }catch(err){
        console.log(err);
    }
});

router.post('/debit',checkAuthenticated,async(req,res)=>{
    try{
        const user = await User.findById(req.user.id);
        const debit = req.body;
        console.log(debit);
        debit.date = getDate();
        const amount = user.amount - (Number)(debit.itemPrice);
        await User.findByIdAndUpdate(req.user.id,{amount:amount,$push:{debits:debit}});
        res.json({'message':"succesfully registered the debit amount"}).status(200);
    }catch(err){
        console.log(err);
    }
});

module.exports = router;
