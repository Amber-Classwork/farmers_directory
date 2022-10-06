const router = require('express').Router();
const CategoryController = require('../controllers/category.controller');

router
    .route("/")
    .get(CategoryController.getAllCategories)
    .post(CategoryController.createCategory)

router
    .route("/:id")
    .get(CategoryController.getCategoryById)
    .patch(CategoryController.updateCategory)
    .delete(CategoryController.deleteCategory);




module.exports = router;