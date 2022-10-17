const router = require('express').Router()
const AdminController = require('../controllers/admin.controller');
const Middleware = require('../middlewares/middleware');
router
    .route("/login")
    .post(AdminController.authenticate);

router
    .route("/")
    .get(Middleware.isAuthenticated,AdminController.getAllAdmins)
    .post(AdminController.createAdmin);
    
router
    .route("/:id")
    .get(Middleware.isAuthenticated, Middleware.isAdmin,AdminController.getAdmin)
    .patch(Middleware.isAuthenticated, Middleware.isAdmin,AdminController.updateAdmin)
    .delete(Middleware.isAuthenticated, Middleware.isAdmin,AdminController.deleteAdmin)
    

module.exports = router;