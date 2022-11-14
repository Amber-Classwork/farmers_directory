const router = require('express').Router();
const ProductController = require('../controllers/product.controller');
const Middleware = require('../middlewares/middleware');
const { uploadFileToFolder } = require('../utilities/s3.utility');

router
    .route("/")
    .get(ProductController.getAllProducts)
    .post(Middleware.isAuthenticated, Middleware.isSuperAdmin,uploadFileToFolder("Products").single("prod_img") ,ProductController.createProduct);

router
    .route("/:id")
    .get(ProductController.getProductById)
    .patch(Middleware.isAuthenticated, Middleware.isSuperAdmin,uploadFileToFolder("Products").single("prod_img"),ProductController.updateProduct)
    .delete(Middleware.isAuthenticated, Middleware.isSuperAdmin,ProductController.deleteProduct)


module.exports = router;