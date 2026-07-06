const express=require("express");
const profileRouter=express.Router();
// const {userAuth}=require("./middleares/auth");
const {userAuth}=require("../middleares/auth");
const validatorProfileEditData=require("../utils/validate");

profileRouter.get("/profile",userAuth,async(req,res)=>{
  try{
 const cookies=req.cookies;
const {token}=cookies;
if(!token){
  throw new Error("Invalid Token");
}

const decodedMessage=await jwt.verify(token,"DEV@Tinder#790")

const{_id}=decodedMessage;
console.log("Logged in user is:"+_id);

const user=await User.findById(_id);
if(!user){
  throw new Error("User does not exist");
}
res.send(user);
//  console.log(cookies);
//  res.send("Reading Cookies");
     
  }
  catch(error){
        res.status(400).send("Something went wrong");
  }
})

profileRouter.post("/profile/edit",userAuth,async(req,res)=>{
    try{
  if(!validatorProfileEditData(req)){
    throw new Error("Invalid Edit Request");

    const loggedInUser=req.user;
    // console.log(loggedInUser);
    
    Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]));
    // console.log(loggedInUser);
    res.send(`${loggedInUser.firstName}, your profile updated successfully`);
   await loggedInUser.save();
   
  }
    }
    catch(err){
         res.status(400).send("ERROR"+err.message);
    }
 
})

module.exports=profileRouter;