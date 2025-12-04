const Users = require('../models/userModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const { promisify }=require('util');

const signToken = id=>{
    return jwt.sign({ id } , process.env.JWT_SECRET ,{
        expiresIn:process.env.JWT_EXPIRES
    } );
}

exports.signup= async (req,res,next)=>{
    const newUser = await Users.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        confirmPassword:req.body.confirmPassword
    });

 try {
       const token = signToken(newUser._id);

    res.status(201).json({
        status:"Success",
        token: token,
         name:newUser.name,
        email:newUser.email
    })
 } catch (error) {
    res.status(401).json({
        status:"FAil",
        message:error
    })
 }
};


exports.login= async (req, res)=>{
    const {email, password}=req.body;

    if(!email || !password){
        res.status(401).json({
            status:"Fail",
            message:"email or password is missing"
        })
        return;
    }

    const user = await Users.findOne({ email }).select('+password');

    if(!user || !(await user.correctPassword(password, user.password))){
         res.status(401).json({
            status:"Fail",
            message:"Incorrect password or email"
        })
        return;
    }
    const token=signToken(user._id);

    res.status(200).json({
        status:"Success",
        token:token,
        name:user.name,
        email:user.email
    })
}

exports.protection= async (req,res, next)=>{
 try {
       let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token =await req.headers.authorization.split(' ')[1];
    }
    if(!token){
       return res.status(400).json({
            status:"Fail",
            message:"Please login again"
        })
    }

    const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
    const currentUser = await Users.findById(decoded.id);
        
        if (!currentUser) {
            return res.status(401).json({
                status: 'fail',
                message: 'The user belonging to this token no longer does exist.'
            });
        }

        
        
        req.user = currentUser; 
       
        next();
 } catch (error) {
    return res.status(400).json({
        status:"Fail",
        message:error
    })
 }
}