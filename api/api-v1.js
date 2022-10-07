const router = require("express").Router();

router.use("/users", require("../routes/user.routes"));
router.use("/categories", require("../routes/category.routes"));
router.use("/products", require("../routes/product.routes"));
router.use("/authenticate", require("../routes/auth.routes"));



module.exports = router;