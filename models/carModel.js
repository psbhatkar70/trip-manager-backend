const mongoose=require('mongoose');

const carSchema= new mongoose.Schema({
    OwnerName:{
        type:String,
        required:true
    },
    OwnerId:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:[true,'A car must have a name'],
        trim:true
    },
    pricePerKm:{
        type:Number,
        required:[true,'A car must have price per Km']
    },
    carNumber:{
        type:String,
        required:[true,'A car must have a number plate'],
        unique:[true,'The number shall be unique']
    },
    driverCost:{
        type:Number,
        default:1000
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    distanceTravelled:{
        type:Number,
        default:0
    },
    totalEarning:{
        type:Number,
        default:0
    }
});

const Car = mongoose.model('Car',carSchema);

module.exports=Car;
