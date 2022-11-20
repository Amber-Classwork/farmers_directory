const router = require('express').Router();
const UserController = require('../controllers/user.controller');
const awsStorage = require("../utilities/s3.utility");
const Middleware = require('../middlewares/middleware');
router
    .route("/")
        .get(Middleware.isAuthenticated,UserController.getAllUsers)
        .post(awsStorage.uploadFileToFolder("User-Profiles").single("image"),UserController.createUserProfile)


router.route("/requestPasswordReset")
    .post(UserController.requestPasswordReset);

router.route("/resetPassword")
    .post(UserController.resetPassword);


router.route("/login")
    .post(UserController.authenticate);

router
    .route("/:id")
        .all(Middleware.isAuthenticated, Middleware.isUserOrSuperAdmin)
        .get(UserController.getUserProfile)
        .patch(awsStorage.uploadFileToFolder("User-Profiles").single("image"),UserController.updateUserProfile)
        .delete(UserController.deleteUserProfile)
    
module.exports = router;