const Trip=require('../models/tripModel');
const Car =require('../models/carModel');
const dayjs = require('dayjs');

exports.createTrip= async (req,res)=>{
    try {
       req.body.OwnerId=req.user._id;
       req.body.OwnerName=req.user.name;
       req.body.date = dayjs(req.body.date).format("DD-MM-YYYY");
    req.body.TripDate = dayjs(req.body.TripDate).format("DD-MM-YYYY");
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
        const tripcost=(distance * car.pricePerKm) + car.driverCost;
        const update = await Car.findByIdAndUpdate(carId,{ $inc: { distanceTravelled: distance ,totalEarning: tripcost} })

         const carinfo={
            name:car.name,
            number:car.carNumber,
            cost:tripcost
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

        
        const trips= await Trip.find({ OwnerId: req.user._id }).populate('car', 'name carNumber');

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
    const carid = req.query.carid;  // <-- this is important

    const filter = { OwnerId: req.user._id };

    if (carid) {
      filter.car = carid;   // <-- add car filter only if user sent carid
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


