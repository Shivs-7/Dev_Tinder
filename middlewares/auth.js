// const jwt=require("jsonwebtoken");
// const User=require("../models/user");
// // const { use } = require("react");

// const userAuth=async(req,res,next)=>{
//     try{
//      const {token}=req.cookies;
//      if(!token){
//         throw new Error(" Token is not valid or present");
//      }
     
//       const decodeObj=await jwt.verify(token,"DEV@Tinder#790");

//       const {_id}=decodeObj;

//       const user=await User.findById(_id);
//       if(!user){
//         throw new Error("User not found");
//       }

//       req.user=user;
//       next();
//     }
//     catch(err){
//      res.status(400).send("ERROR"+err.message);
//         }
// };
// module.exports={
//     userAuth,
// };
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("Unauthorized: Token missing");
    }

    const decoded = jwt.verify(token, "DEV@Tinder#790");

    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).send("Unauthorized: User not found");
    }

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).send("Unauthorized");
  }
};

module.exports = {
  userAuth,
};