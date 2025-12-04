const Car =require('../models/carModel');

exports.createCar = async (req,res)=>{
    try {
       req.body.OwnerId=req.user._id;
       req.body.OwnerName=req.user.name;
        const newCar=await Car.create(req.body);

        res.status(201).json({
            status:"Success",
            data:{
                newCar
            }
        })
    } catch (error) {
        res.status(400).json({
            status:"Fail",
            message:error.message
        })
    }
}

exports.getAllCars = async (req,res)=>{
    try {
        const cars= await Car.find({ OwnerId: req.user._id });

        res.status(200).json({
            status:"Success",
            data:{
                cars
            }
        })
    } catch (error) {
        res.status(404).json({
            status:"Fail",
            message: error.message
        })
        
    }
}

exports.getSingleCar = async (req,res)=>{
    try {
        const car= await Car.findById(req.params.carid);
        res.status(200).json({
            status:"Success",
            data:car
        })
    } catch (error) {
        res.status(404).json({
            status:"Fail",
            message: error.message
        })
        
    }
}