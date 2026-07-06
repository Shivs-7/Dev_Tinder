const express=require("express");
// const User = require("./models/user");
const User=require("../models/user");
const requestRouter=express.Router();
const Chat=require("../models/chat");
// const {userAuth}=require("./middleares/auth");
const {userAuth}=require("../middleares/auth");
const ConnectionRequest=require("../models/connectionRequest");

requestRouter.post("/sendConnectionRequest",userAuth,async(req,res)=>{
  // try{
    //Logic
    const user=req.user;

    console.log("Connection Request Sent!");
    res.send(user.firstName + "Sending a Connection Request");

  // }
//   catch(err){

//   }
});

requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
  try{
     
    const fromUserId=req.user._id;
    const toUserId=req.params.toUserId;
    const status=req.params.status;

    const allowedStatus=["ignored","interested"];
    if(!allowedStatus.includes(status)){
      return res.status(400).json({message: "Invalid status type:"+status});
    }

  //  if(fromUserId==toUserId){
  //   return re
  //  }

    const toUser=await User.findById(toUserId);
    if(!toUser){
      return res.status(404).json({
        message:"User is not found",
      })
    }

    const existingConnectionRequest=await ConnectionRequest.findOne({
      $or:[{fromUserId, toUserId},
      {fromUserId:fromUserId,toUserId:toUserId},
      ],
    })
     
    if(existingConnectionRequest){ 
      return res.status(400).send({message:"Connection Request already exists!!"});
    }
    const connectionRequest=new ConnectionRequest({
      fromUserId, 
      toUserId,
      status,
    });

    const data=await connectionRequest.save();
    res.json({
      message:"Connection Request Sent Successfully",
      data,
    });

  }
  catch(err){
 res.status(400).send("ERROR "+err.message);
  }
});

requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
  try{

    const loggedIn=req.user;
    const {status,requestId}=req.params;
    const allowedStatus=["accepted","rejected"];
     if(!allowedStatus.includes(status)){
      return res.status(400).json({
        message:"Status is not valid status",
        // error:message.error,
      });
     }

     const connectionRequest=await ConnectionRequest.findOne({
      _id:requestId,
      toUserId:loggedIn._id,
      status:"interested",
     });
     if(!connectionRequest){
      return res.status(400).json({message:"Connection is not found"});
     }

     // current status updated
     connectionRequest.status=status;
     const data=await connectionRequest.save();

     const chat=new Chat({
      participants:[
        connectionRequest.fromUserId,
        connectionRequest.toUserId,
      ]
     });
     await chat.save();

     res.json({message:"connection request"+status,data});
       //Validate the status
       //from=>toUser
       //loggedIn=>toUserId
       //status=interested
       //request Id should be valid
  }
  catch(error){
    res.status(400).json({
      message:error.message,
    });
  }
})

module.exports=requestRouter;