const router = require('express').Router();
const CategoryController = require('../controllers/category.controller');
const Middleware = require('../middlewares/middleware');
const awsStorage = require('../utilities/s3.utility');
router
    .route("/")
    .get(CategoryController.getAllCategories)
    .post(Middleware.isAuthenticated,Middleware.isUserOrSuperAdmin,awsStorage.uploadFileToFolder("Categories").single("categoryImg"),CategoryController.createCategory)

router
    .route("/:id")
    .get(CategoryController.getCategoryById)
    .patch(Middleware.isAuthenticated,Middleware.isUserOrSuperAdmin,awsStorage.uploadFileToFolder("Categories").single("categoryImg"),CategoryController.updateCategory)
    .delete(Middleware.isAuthenticated,Middleware.isUserOrSuperAdmin,CategoryController.deleteCategory);



module.exports = router;