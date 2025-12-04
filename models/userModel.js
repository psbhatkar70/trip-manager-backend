const mongoose = require('mongoose');
const validator=require('validator');
const bcrypt = require('bcrypt');


const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,'You must tell a name']
    },
    email:{
        type:String,
        required:[true,'You must tell email'],
        validate: [validator.isEmail],
        unique:[true,'Email must be unique'],
        lowercase:true
    },
    password:{
        type:String,
        minlength:8,
        required:[true,'Please provide a password'],
        select:false
    },
    confirmPassword:{
        type:String,
        required:[true,'Please confirm password'],
        validate: {
            validator: function(el){
                return el===this.password;
            }, message:'Password are not same'
        }
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});

userSchema.pre('save',async function(){
    if (!this.isModified('password')) return ;

    this.password =await bcrypt.hash(this.password, 12);
    this.confirmPassword= undefined;
   
});

userSchema.methods.correctPassword =async function(candidatepassword,userpassword){
    return await bcrypt.compare(candidatepassword,userpassword);
}


const Users= mongoose.model('Users',userSchema);

module.exports=Users;