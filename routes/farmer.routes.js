const router = require('express').Router();
const FarmerController = require('../controllers/farmer.controller');
const Middleware = require('../middlewares/middleware');



router
    .route("/login")
    .post(FarmerController.authenticate)
router
    .route("/")
    .get(Middleware.isAuthenticated,Middleware.isUserOrAdmin,FarmerController.getAllFarmers)
    .post(FarmerController.createFarmerProfile)
    
router
    .route("/:id")
    .get(Middleware.isAuthenticated,Middleware.isUserOrAdmin,FarmerController.getFarmerProfile)
    .patch(Middleware.isAuthenticated,Middleware.isUserOrAdmin,FarmerController.updateFarmerProfile)
    .delete(Middleware.isAuthenticated,Middleware.isUserOrAdmin,FarmerController.deleteFarmerProfile)
    
module.exports = router;