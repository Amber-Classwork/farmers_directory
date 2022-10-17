const Admin = require("../schema/admin.schema");
const { JSONResponse } = require("../utilities/jsonResponse");
const { generateJWTToken } = require("../utilities/tokenGenerator");

class AdminController {
   static authenticate = async (req, res, next) => {
      try {
         let { email, password } = req.body;
         let admin = await Admin.findOne({ email: email });
         if (!admin)
            throw new Error("No admin present which matches the email");
         let passCheck = await admin.isCorrectPassword(password);
         if (!passCheck) throw new Error("Invalid password");
         let data = admin;
         let token = generateJWTToken(
             { id: admin._id, email: admin.email, username: admin.username},
             "3600"
             );
             data.password = undefined;
         JSONResponse.success(
            res,
            "Admin is authenticated successfully",
            { admin, token },
            200
         );
      } catch (error) {
         JSONResponse.error(res, "Admin not Authenticated", error, 401);
      }
   };
   static getAllAdmins = async (req, res, next) => {
      try {
         let admins = await Admin.find();
         JSONResponse.success(res,"Retrieved all admin successfully",admins,201);
      } catch (error) {
         JSONResponse.error(res, "Error Retrieving admin profile", error, 404);
      }
   };

        /**
     * 
     * ### Description
     * Creates a admin profile with the data that the admin passes in the body.
     * @param {Request} req 
     * @param {Response} res 
     * @param {Next} next 
     */
    static createAdmin = async(req, res, next)=>{
        try{
            let data = req.body;
            if(Object.keys(data).length == 0) throw new Error("No data passed to create admin profile");
            let admin = await new Admin(data).save();
            admin.password = undefined;
            JSONResponse.success(res, "Admin profile successfully created", admin, 201);
        }catch(error){
            JSONResponse.error(res, "Error creating admin profile", error, 400);
        }
    }

        /**
     * 
     * ### Description
     * Gets the admin profile for a single admin with the id that is passed in as a parameter, then updates the admin with the data that is passed in the body.
     * @param {Request} req 
     * @param {Response} res 
     * @param {Next} next 
     */
    static updateAdmin = async(req, res, next)=>{
        try{
            let data = req.body;
            let id = req.params.id;
            if(!ObjectId.isValid(id)) throw new Error("Invalid ID was passed as a parameter");
            if(Object.keys(data).length == 0) {
                return JSONResponse.success(res, "No data passed, file not updated",{}, 200);
            }
            let admin = await Admin.findOneAndUpdate({_id:id},data, {new:true});
            if(!admin) throw new Error("Admin not found with the ID");
            JSONResponse.success(res, "Admin updated successfully", admin, 200);
        }catch(error){
            JSONResponse.error(res, "Unable to update admin profile", error, 404);
        }
    }

   /**
    *
    * ### Description
    * Gets the admin profile for a single admin with the id that is passed in as a parameter and deletes it, returning the admin that was deleted.
    * @param {Request} req
    * @param {Response} res
    * @param {Next} next
    */
   static deleteAdmin = async (req, res, next) => {
      try {
         let id = req.params.id;
         if (!ObjectId.isValid(id))
            throw new Error("ID does not match any user profile in database");
         let admin = await Admin.findByIdAndDelete(id);
         if (!admin) throw new Error("Admin does not exist with this ID");
         JSONResponse.success(res, "Successfully deleted admin", admin, 203);
      } catch (error) {
         JSONResponse.error(res, "Unable to delete admin", error, 404);
      }
   };

   /**
    *
    * ### Description
    * Gets the admin profile for a single admin with the id that is passed in as a parameter.
    * @param {Request} req
    * @param {Response} res
    * @param {Next} next
    */
   static getAdmin = async (req, res, next) => {
      try {
         let id = req.params.id;
         if (!ObjectId.isValid(id))
            throw new Error("Id is not a valid user profile in database");
         let admin = await Admin.findById(id);
         if (!admin) throw new Error("Admin not found with this id");
         admin.password = undefined;
         JSONResponse.success(res, "Retrieved admin info", admin, 200);
      } catch (error) {
         JSONResponse.error(res, "Unable to find admin", error, 404);
      }
   };
}

module.exports = AdminController;
