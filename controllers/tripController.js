const Trip=require('../models/tripModel');
const Car =require('../models/carModel');
const dayjs = require('dayjs');
const mongoose=require('mongoose');

exports.createTrip= async (req,res)=>{
    try {
    req.body.OwnerId=req.user._id;
    req.body.OwnerName=req.user.name;
    // req.body.date = Date.now();
    req.body.TripDate = new Date(req.body.TripDate);
    req.body.TripDateEnd=new Date(req.body.TripDateEnd);
        const data=req.body;
        const carId=data.car;
        const distance=data.distance;
        const car = await Car.findById(carId);
          if (!car) {
            return res.status(404).json({
                status: 'fail',
                message: 'Car not found with that ID'
            });
        }

       
        
      if(car.OwnerId.toString() !== req.user._id.toString()){
        return res.status(403).json({
            status:"Failed",
            message:"You do not own this car you can not create trip for this car!"
        })
      }
    const targetCarId = new mongoose.Types.ObjectId(carId);
    const existingtrip = await Trip.findOne({carId : targetCarId, TripDateEnd : {$gte : req.body.TripDate} , TripDate :{$lte : req.body.TripDateEnd}});
        if (existingtrip) {
            return res.status(409).json({ 
                status: "Fail",
                message: `Car already booked for dates from ${dayjs(existingtrip.TripDate).format("DD-MM-YYYY")} to ${dayjs(existingtrip.TripDateEnd).format("DD-MM-YYYY")}`,
        });
    }
        const tripcost=(distance * car.pricePerKm) + car.driverCost;
        const update = await Car.findByIdAndUpdate(carId,{ $inc: { distanceTravelled: distance ,totalEarning: tripcost} })

         const carinfo={
            name:car.name,
            number:car.carNumber,
            cost:tripcost,
            carId:carId
        }
        
        const newTrip=await Trip.create({...req.body, ...carinfo});

        res.status(201).json({
            status:"Success",
            data:{
                newTrip
            }
        })

    } catch (error) {
        res.status(404).json({
            status:"Fail",
            message: error.message
        })
    }
}

exports.getAllTrips = async (req,res)=>{
    try {

        
        const trips= await Trip.find({ OwnerId: req.user._id });

        res.status(200).json({
            status:"Success",
            data:{
                trips
            }
        })
    } catch (error) {
        res.status(404).json({
            status:"Fail",
            message: error.message
        })
        
    }
}

exports.getTripStats = async (req,res)=>{
    try {
        const stats= await Trip.aggregate([
            {
                $match:{OwnerId:req.user._id.toString()}
            },
            {

                $group:{
                    _id: "$number",
                    totalincome:{$sum:"$cost"},
                    Car:{ $first: '$name' },
                    TotalTrips:{$sum:1},
                    TotalDistance:{$sum:"$distance"}
                }
            },
            {
                $sort:{totalincome:-1}
            }
        ])

        res.status(200).json({
            status:"Success",
            data:{
                stats
            }
        })
    } catch (error) {
         res.status(404).json({
            status:"Fail",
            message: error.message
        })
    }
}

exports.getTrips = async (req, res) => {
  try {
    const carid = req.query.carid;  

    const filter = { OwnerId: req.user._id };

    if (carid) {
      filter.car = carid;   
    }

    const trips = await Trip.find(filter)
      .populate("car", "name carNumber");

    res.status(200).json({
      status: "Success",
      data: { trips }
    });

  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};


