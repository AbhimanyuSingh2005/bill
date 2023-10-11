const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true 
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    amount:{
        type:Number,
        default:0
    },
    transaction : [
        {
            reason:String,
            amount:Number,
            date : String,
            debit : {
                type:Boolean,
                default:false
            }
        }
    ]
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

module.exports = User;