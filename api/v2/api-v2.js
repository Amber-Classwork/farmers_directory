const router = require("express").Router();

router.use("/farmers", require("./routes/farmer.routes"));
router.use("/categories", require("./routes/category.routes"));
router.use("/products", require("./routes/product.routes"));
router.use("/users", require("./routes/user.routes"));



module.exports = router;