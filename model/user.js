const mongoose=require("mongoose");
const validator=require("validator");

const userSchema=mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        index:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    emailId:{
        type:String,
        lowercase:true,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address"+ value);
            }
        },
    },
    password:{
        type:String,
        required:true,
          validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Your password is not strong, make a strong password"+ value);
            }
        },
    },
    age:{
        type:Number,
        min:18,
        // required:true,
    },
    gender:{
        type:String,
        enum:{
        values:["male","female","others"],
        message:`{$VALUE} is not a valid gender type`
        },
        // validate(value){
        //  if(!["male","female","others"].includes(value)){
        //     throw new Error("Gender data is not valid");
        //  }
        // },
        // required:true, 
    },
    photoUrl:{
        type:String,
        default:"https://www.pngitem.com/pimgs/m/272-2720656_user-profile-dummy-hd-png-download.png"
    },
    about:{
        type:String,
    },
    skills:{
        type:[String],
    }
},{
    timestamps:true,
});

module.exports=mongoose.model("User",userSchema);