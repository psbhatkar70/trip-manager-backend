const express=require('express');
const router=express.Router();
const tripController=require('../controllers/tripController');
const authController = require('../controllers/authController');

router.route('/').post(authController.protection,tripController.createTrip).get(authController.protection,tripController.getAllTrips);
router.route('/stats').get(authController.protection,tripController.getTripStats);
router.route('/car').get(authController.protection,tripController.getTrips);

module.exports=router;