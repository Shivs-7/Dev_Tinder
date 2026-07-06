const express=require("express");
const userRouter=express.Router();
const {userAuth}=require("../middleares/auth");
const ConnectionRequest=require("../models/connectionRequest");
const USER_SAFEDATA="firstName lastName photoUrl age gender about skills"
const User=require("../models/user");

userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
    try{
   const loggedInUser=req.user;
   const connectionRequests=await ConnectionRequest.find({
    toUserId:loggedInUser._id,
    status:"interested",
   }).populate("fromUserId",["firstName","lastName"]);

   res.json({
    message:"Data fetched successfully",
    data:connectionRequests,
   });

    }
    catch(error){
     console.log(err);
     res.status(400).send(err.message);
    }
});

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
     const loggedInUser=req.user;

     const connectionRequests=await ConnectionRequest.find({
        $or:[
            {toUserId: loggedInUser._id,status:"accepted"},
            {fromUserId: loggedInUser._id, status:"accepted"},
        ],
     }).populate("fronUserId",USER_SAFEDATA);
     const data=connectionRequests.map((row)=>row.fromUserId);
     res.json({data});
    }
    catch(error){
     res.status(400).send({message:err.message});
    }
});

userRouter.get("/feed",userAuth,async(req,res)=>{
    try{
      
        const loggedInUser=req.user;
        const page=parseInt(req.query.page) || 1;
        let limit=parseInt(req.query.limit) || 10;
        limit=limit>50 ? 50: limit;
        const skip=(page-1)*limit;

        const connectionRequests=await ConnectionRequest.find({
            $or:[{fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}],
        }).select("fromUserId  toUserId");

        //Hiding repeated user's 
        const hideUsersFromFeed=new Set();
        connectionRequests.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });
        
        const users=await User.find({
           $and:[ 
            {_id:{$nin:Array.from(hideUsersFromFeed)}},
            {_id:{$ne:loggedInUser._id}},
           ]
        }).select(USER_SAFEDATA).skip(skip).limit(limit);

        res.send(connectionRequests);
    }

    catch(error){
          res.status(400).json({message:err.message});
    }
});


module.exports=userRouter;