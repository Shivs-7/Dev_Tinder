const validator=require("validator");

const validateSignUpData=(req)=>{

  const {firstName,lastName,emailId,password}=req.body;

  if(!firstName || !lastName || !emailId || !password){
     throw new Error("Please fill all the required fields");   
  }
  else  if(!validator.isEmail(emailId)){
     throw new Error("Please enter a valid emailId");
  }
  else if(!validator.isStrongPassword(password)){
    throw new Error("Please enter a Strong Password");
  }
};

const validatorProfileEditData=(req)=>{
  try{
  const allowedEditFeilds=[
    "firstName",
    "lastName",
    "emailId", 
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];
  const isEditAllowed=Object.keys(req.body).every((feild)=>{
    allowedEditFeilds.includes(feild);
  });

  return isEditAllowed;
  }
  catch(err){

  }
}

module.exports=validateSignUpData;
module.exports=validatorProfileEditData;