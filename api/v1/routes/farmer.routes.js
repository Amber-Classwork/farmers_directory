const router = require('express').Router();
const FarmerController = require('../controllers/farmer.controller');
const Middleware = require('../middlewares/middleware');
const awsStorage = require("../../../utilities/s3.utility");


router
    .route("/login")
    .post(FarmerController.authenticate)
router
    .route("/")
    .get(Middleware.isAuthenticated,FarmerController.getAllFarmers)
    .post(FarmerController.createFarmerProfile,awsStorage.uploadFileToFolder("User-Profiles").single("image"))
    
router
    .route("/:id")
    .get(Middleware.isAuthenticated,FarmerController.getFarmerProfile)
    .patch(Middleware.isAuthenticated,Middleware.isUserOrSuperAdmin,awsStorage.uploadFileToFolder("User-Profiles").single("image"),FarmerController.updateFarmerProfile)
    .delete(Middleware.isAuthenticated,Middleware.isUserOrSuperAdmin,FarmerController.deleteFarmerProfile)
    
module.exports = router;