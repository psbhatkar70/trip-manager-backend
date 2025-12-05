const mongoose=require('mongoose');
const Car=require('./carModel');

const tripSchema=new mongoose.Schema({
    TripName:{
        type:String,
        required:[true,'A trip must have a name']
    },
    TripDate:{
        type:String,
        default:Date.now()
    },
    OwnerName:{
        type:String,
        required:true
    },
    OwnerId:{
        type:String,
        required:true
    },
    car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car'
    },
    name: String,
    number: String,
    date:{
        type:String,
        default:Date.now()
    },
    distance:{
        type:Number,
        required:[true,'A trip must have a distance']
    },
    cost:{
        type:Number
    }
});

const Trip=mongoose.model('Trip',tripSchema);

module.exports=Trip;