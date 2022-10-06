const router = require('express').Router();
const CategoryController = require('../controllers/category.controller');
const Middleware = require('../middlewares/middleware');

router
    .route("/")
    .get(CategoryController.getAllCategories)
    .post(Middleware.isAuthenticated,Middleware.isSuperAdmin,CategoryController.createCategory)

router
    .route("/:id")
    .get(CategoryController.getCategoryById)
    .patch(Middleware.isAuthenticated,Middleware.isSuperAdmin,CategoryController.updateCategory)
    .delete(Middleware.isAuthenticated,Middleware.isSuperAdmin,CategoryController.deleteCategory);



module.exports = router;