const express=require("express");
const validateSignUpData=require("../utils/validate");
const authRouter=express.Router();
const User=require("../models/user");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

authRouter.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req);

 const {firstName,lastName,emailId,password}=req.body;

 const passwordHash= await bcrypt.hash(password,10)
 console.log(passwordHash);

    // validate the password 

    // Encrypt the password
  
    // console.log(req.body);

    const userobj=new User({
      firstName,
      lastName,
      emailId,
      password:passwordHash,
    });
    await userobj.save();

    res.send("User saved successfully");
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

// authRouter.post("/login",async(req,res)=>{
//   try{
//     const {emailId,password}=req.body;
//     const user=await User.findOne({emailId:emailId});
//     if(!user){
//       throw new Error("EmailID is not present in DB");
//     }

//     const isPasswordValid=await bcrypt.compare(password,user.password);
 
//     if(isPasswordValid){
      
//       const token=await jwt.sign({_id: user._id},"DEV@Tinder#790",{expiresIn :'1h'});
//       console.log(token);
//       res.cookie("token",token);
//       res.send("User LoggedIn");
//     }
//       else{
//         throw new Error("Some Error Occured while login");
//     }
//   }
//   catch(err){
//      console.log(err);
//     res.status(400).send(err.message);
//   }
// })
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    console.log("Email:", emailId);
    console.log("Entered Password:", JSON.stringify(password));

    const user = await User.findOne({ emailId });

    console.log("User Found:", user);

    if (!user) {
      throw new Error("EmailID is not present in DB");
    }

    console.log("Stored Hash:", user.password);

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    console.log("Password Match:", isPasswordValid);

    if (isPasswordValid) {
      const token = jwt.sign(
        { _id: user._id },
        "DEV@Tinder#790",
        { expiresIn: "1h" }
      );

      res.cookie("token", token);
      res.send("User LoggedIn");
    } else {
      throw new Error("Invalid Password");
    }
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

authRouter.post("/logout",async(req,res)=>{
   
    res.cookie("token",null,{
        expires:new Date(Date.now()),
    });
    res.send("logout Successful");
   
 });

module.exports=authRouter; 