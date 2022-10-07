const router = require('express').Router();
const ProductController = require('../controllers/product.controller');
const { uploadFileToS3 } = require('../utilities/s3');

router
    .route("/")
    .get(ProductController.getAllProducts)
    .post(uploadFileToS3.single("prod_img") ,ProductController.createProduct);

router
    .route("/:id")
    .get(ProductController.getProductById)
    .patch(uploadFileToS3.single("prod_img"),ProductController.updateProduct)
    .delete(ProductController.deleteProduct)


module.exports = router;