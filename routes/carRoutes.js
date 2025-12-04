const express=require('express');
const carController=require('../controllers/carController');
const authController=require('../controllers/authController');
const router=express.Router();

router.route('/').post(authController.protection,carController.createCar).get(authController.protection,carController.getAllCars);
router.route('/:carid').get(authController.protection,carController.getSingleCar)

module.exports=router;