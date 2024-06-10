import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import maerr from '../utils/error.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import express from 'express'

export const Signup = async (req,res,next) => {

    const {username,email,password} = req.body;
    const hashedpassword = bcryptjs.hashSync(password,10);
    const newUser = await User.create({username,email,password : hashedpassword});
    try {
    await newUser.validate();
    return res.status(201).json("User Created Successfully!");
    } catch(error){
        next(error)
    }
}


export const Signin = async (req,res,next) => {

    const {email,password} = req.body;
    try {
      const validUser = await User.findOne({email});
      if(!validUser) return next(maerr(404,'User Not Found'));
      const validPassword = bcryptjs.compareSync(password,validUser.password)
      if(!validPassword) return next(maerr(401,'Wrong Credentials'))
      const token = jwt.sign({id:validUser._id }, process.env.JWT_SECRET)
      const {password: pass,...rest} = validUser._doc
      res.cookie('access_token',token,{httpOnly: true})
      .status(200)
      .json(rest)
    }
    catch(error)
    {
    next(error)
    }
}

export const Signout = async(req,res,next) =>{
  try{

  } catch(error){
    next(error)
  }
}

export const Authgoogle = async (req,res,next) =>{
    try{
      const user = await User.findOne({email : req.body.email})
      console.log(req.body);
      if(user){
        // Register the User
        const token = jwt.sign({id:user._id }, process.env.JWT_SECRET)
        const {password: pass,...rest} = user._doc
        res.cookie('access_token',token,{httpOnly: true})
        .status(200)
        .json(rest)
      } else{
        // We need to create the User
        const generatedPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(generatedPassword,10);
        const newUser = new User({username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4), email: req.body.email, password: hashedPassword,avatar: req.body.photo});
        await newUser.save();
        const token = jwt.sign({id:newUser._id }, process.env.JWT_SECRET)
        const {password: pass,...rest} = newUser._doc
        res.cookie('access_token',token,{httpOnly: true})
        .status(200)
        .json(rest)  
    }
    } 
    catch(error)
    {
       next(error);
    }
}

export const Updateuser = async(req,res,next) => {
  try{
    const user = await User.findOne({email : req.body.email})
    //console.log(req.body);
    const prevpassword = user.password;
    const newusername = req.body.username;
    // user = ({username : req.body.username, email : req.body.email, password : bcryptjs.hashSync(req.body.password,10), avatar : req.body.avatar});

    const validPassword = bcryptjs.hashSync(req.body.password,10);
    console.log(prevpassword)
    console.log(req.body.password)
    
    bcrypt.compare(req.body.password,prevpassword,async function(err,result){
      if(err){
        console.log("Password Matching Error");
        return;
      }
      console.log(result);
      if(result){
        console.log("User Updated Successfully");
        await User.findByIdAndUpdate(user.id,{username : req.body.username, email : req.body.email, password : prevpassword, avatar : req.body.avatar},{new:true});
        return res.status(201).json("User Updated Successfully!");
      } else{
        return next(maerr(401,'Wrong Credentials'));
        //return res.status(500).json("Wrong Password")
      }
    })


  } 
  catch(error)
  {
    next(error);
  }
}

export const SignOutUser = async(req,res,next) => {
  try{
    res.clearCookie('access_token');
    return res.status(201).json("User Logout Successfully!");
  } catch(error){
    console.log(error);
  }
}

export const Deleteuser =  async(req,res,next) => {
   try{
      console.log(req.body);
      const user = await User.findOne({email : req.body.email})
      //console.log(user);
      // bcrypt.compare(passkey,user.password,async function(err,result){
      //   if(err){
      //     console.log("Password Matching Error")
      //     return;
      //   }

      //   if(result)
      //   {
      await User.findOneAndDelete({email : req.body.email});
      res.clearCookie('access_token');
      return res.status(201).json("User Deleted Successfully!");
      //   else {
      //     return next(maerr(401,'Wrong Credentials'));
      //   }
      // })
      // if(localStorage.getItem(tokenkey)){
      //   localStorage.removeItem(tokenkey);
      //   console.log('JWT Deleted Succssfully');
      // } else{
      //   console.log('NO JWT Found');
      // }
   } catch(error){
    next(error);
   }
}