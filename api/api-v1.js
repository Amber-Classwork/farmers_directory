const router = require("express").Router();

router.use("/users", require("../routes/user.routes"));
router.use("/authenticate", require("../routes/auth.routes"));



module.exports = router;