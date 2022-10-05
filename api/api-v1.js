const router = require("express").Router();

router.use("/users", require("../routes/user.routes"));



module.exports = router;