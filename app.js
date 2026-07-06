
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const connectdb = require("./config/database");
const User = require("./models/user");
const Chat=require("./models/chat");

// const validateSignUpData=require(".././src/utils/validate");


const bcrypt=require("bcrypt");
// const { use } = require("react");
const cookieParser=require('cookie-parser');
const jwt=require("jsonwebtoken");
// const { use } = require("react");
// const {userAuth}=require("./middleares/auth");
const{userAuth}=require("./middleares/auth")

app.use(express.json());
app.use(cookieParser());

const authRouter=require("./route/auth");
const profileRouter=require("./route/profile");
const requestRouter=require("./route/request");
const userRouter=require("./route/user");

app.use("/",authRouter);
app.use("/",requestRouter);
app.use("/",profileRouter);
app.use("/",userRouter);

app.get("/",(req,res)=>{
  res.send("Hi");
})

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// io.on("connection", (socket) => {
//   console.log("✅ New User Connected:", socket.id);

//   socket.on("disconnect", () => {
//     console.log("❌ User Disconnected:", socket.id);
//   });
// });
io.on("connection", (socket) => {

    console.log("✅ New User Connected:", socket.id);

    socket.on("joinChat", (chatId) => {

        socket.join(chatId);

        console.log(
            `Socket ${socket.id} joined room ${chatId}`
        );

    });

    socket.on("disconnect", () => {

        console.log("❌ User Disconnected:", socket.id);

    });

});



app.get("/feed",async(req,res)=>{
  try{
      // const user=req.body;
      // const users=await User.find({});
      // res.send(users); 
      const UserEmail=req.body.emailId;
      const users=await User.findOne({emailId:UserEmail});
      res.send(users);
  }
  catch(error){
     res.status(400).send("Something went wrong");
  }
});

app.delete("/delete",async(req,res)=>{
  const userID=req.body.userId;
  try{
      const user=await User.findByIdAndDelete(userID);
      res.send("User Deleted Successfully");
  }
  catch(error){
     res.status(400).send("Not able to delete the id");
  }
})

app.patch("/user",async(req,res)=>{
  const userId=req.body.userId;
  const data=req.body;
//   try{
//    await User.findByIdAndUpdate({_id:data},data,{new : true});
//    res.send("User updated Successfully");
//   }
//   catch(error){
//   res.status(400).send("Something went wrong"); 
//   }
// })

try {

  const ALLOWED_UPDATES=["photoUrl","age","password"];
const isUpdateAllowed=Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k));
if(!isUpdateAllowed){
  throw new Error("Update is not allowed");
};
    const user = await User.findByIdAndUpdate(userId, data, { new: true });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.send("User updated Successfully");
  } catch (error) {
    res.status(400).send("Something went wrong",err.message);
  }
});


connectdb()
  .then(() => {
    console.log("Database connection established");

    server.listen(3000, () => {
      console.log("🚀 Server is running at PORT 3000");
    });
  })
  .catch((error) => {
    console.log("Database cannot be established");
    console.log(error);
  });