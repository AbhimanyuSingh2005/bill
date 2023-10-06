const express = require("express");
const passport = require('passport');

const router = express.Router();

const User = require("../model/userSchema");


router.get("/", (req, res) => {
    res.send("Hello this is home router.")
})



///////////////////////////////////////////////////////////  get route ////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////// register post route ////////////////////////////////////////////////////////////////////////////////////

router.post("/register",async (req,res)=>{
    const { name , username , password , cpassword} = req.body;
    try{
        if(!name || !username || !password || !cpassword ){
            return res.status(422).json({error : "fill all the details"});
        }
        else if(password !== cpassword){
            return res.status(422).json({json : "password and confirm password are not matching."})
        }
        else{
            User.register(new User({name:name,username : username }), password,function(err,user){
                if(err){
                    return res.send(err);            
                }
                res.send('login kar jake');
            })
        }
    }
    catch(err){
        console.log(err);
    };
});


/////////////////////////////////////////////////////////// login post route ////////////////////////////////////////////////////////////////////////////////////

router.post("/login",async(req,res)=>{
    const {username , password}= req.body;
    try{
        if(!username || ! password){
            return res.status(400).json({error : "fill all the details."});
        }
        const user = new User({
            username : req.body.username,
            password : req.body.password
        });
        req.login(user,function(err,user){
            if(err){
                console.log(err);
            }else{
                passport.authenticate("local")(req,res,function(){
                    res.redirect('/bill');
                });
            };
        });
        
    }catch(err){
        console.log(err);
    }
})

/////////////////////////////////////////////////////////// login post route ////////////////////////////////////////////////////////////////////////////////////

router.post('/logout',(req,res)=>{
    req.logOut((err)=>{
        if(err){
            return res.send(err);
        }
        res.send('ho gaya logout');
    })
    
})

function checkAuthenticated(req,res,next){
    if (req.isAuthenticated()){
        return next();
    }
    res.send('login kar ke aa');
}

exports.router = router;
exports.checkAuthenticated = checkAuthenticated ;