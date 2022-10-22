const Farmer = require("../schema/farmer.schema");
const { JSONResponse } = require("../utilities/jsonResponse");
const { generateJWTToken } = require("../utilities/tokenGenerator");
const { ObjectId } = require("mongoose").Types;

class FarmerController {


   static authenticate = async (req, res, next) => {
      try {
         let { email, password } = req.body;
         if(email) email = email.toLowerCase();
         let farmer = await Farmer.findOne({ email: email });
         if (!farmer)
            throw new Error("No farmer present which matches the email");
         let passCheck = await farmer.isCorrectPassword(password);
         if (!passCheck) throw new Error("Invalid password");
         let data = farmer;
         let token = generateJWTToken(
             { id: farmer._id, email: farmer.email, isSuperAdmin: farmer.isSuperAdmin},
             "3600"
             );
             data.password = undefined;
         JSONResponse.success(
            res,
            "Farmer is authenticated successfully",
            { farmer, token },
            200
         );
      } catch (error) {
         JSONResponse.error(res, "Farmer not Authenticated", error, 401);
      }
   };


   /**
    *
    * ### Description
    * Gets all the farmers profiles in the database
    * @param {Request} req
    * @param {Response} res
    * @param {Next} next
    */
   static getAllFarmers = async (req, res, next) => {
      try {
         let Farmers = await Farmer.find();
         JSONResponse.success(res,"Retrieved all Farmers successfully",Farmers,201);
      } catch (error) {
         JSONResponse.error(res, "Error Retrieving farmers profile", error, 404);
      }
   };

        /**
     * 
     * ### Description
     * Creates a farmer profile with the data that the farmer passes in the body.
     * @param {Request} req 
     * @param {Response} res 
     * @param {Next} next 
     */
    static createFarmerProfile = async(req, res, next)=>{
        try{
            let data = req.body;
            if(Object.keys(data).length == 0) throw new Error("No data passed to create user profile");
            if(data.products && !Array.isArray(data.products)){
                  data.products = [data.products];  
            }
            let farmer = await new Farmer(data).save();
            farmer.password = undefined;
            JSONResponse.success(res, "Farmer profile successfully created", farmer, 201);
        }catch(error){
            JSONResponse.error(res, "Error creating farmer profile", error, 400);
        }
    }

        /**
     * 
     * ### Description
     * Gets the farmer profile for a single farmer with the id that is passed in as a parameter, then updates the farmer with the data that is passed in the body.
     * @param {Request} req 
     * @param {Response} res 
     * @param {Next} next 
     */
    static updateFarmerProfile = async(req, res, next)=>{
        try{
            let data = req.body;
            let id = req.params.id;
            if(!ObjectId.isValid(id)) throw new Error("Invalid ID was passed as a parameter");
            if(Object.keys(data).length == 0) {
                return JSONResponse.success(res, "No data passed, file not updated",{}, 200);
            }
            if(data.email) data.email = data.email.toLowerCase();
            let farmer = await Farmer.findById(id);
            if(!farmer) throw new Error("Farmer not found with the ID");
            if(data.products && Array.isArray(data.products)){
               data.products.forEach((product)=>{
                  if(!farmer.products.includes(product)){
                     farmer.products.push(product);
                  }
               });
            }else if(data.products && farmer.products){
               if(!farmer.products.includes(data.products)){
                  farmer.products.push(products);
               }
            }
            JSONResponse.success(res, "Farmer updated successfully", farmer, 200);
        }catch(error){
            JSONResponse.error(res, "Unable to update farmer profile", error, 404);
        }
    }

   /**
    *
    * ### Description
    * Gets the farmer profile for a single farmer with the id that is passed in as a parameter and deletes it, returning the farmer that was deleted.
    * @param {Request} req
    * @param {Response} res
    * @param {Next} next
    */
   static deleteFarmerProfile = async (req, res, next) => {
      try {
         let id = req.params.id;
         if (!ObjectId.isValid(id))
            throw new Error("ID does not match any user profile in database");
         let farmer = await Farmer.findByIdAndDelete(id);
         if (!farmer) throw new Error("Farmer does not exist with this ID");
         JSONResponse.success(res, "Successfully deleted farmer", farmer, 203);
      } catch (error) {
         JSONResponse.error(res, "Unable to delete farmer", error, 404);
      }
   };

   /**
    *
    * ### Description
    * Gets the farmer profile for a single farmer with the id that is passed in as a parameter.
    * @param {Request} req
    * @param {Response} res
    * @param {Next} next
    */
   static getFarmerProfile = async (req, res, next) => {
      try {
         let id = req.params.id;
         if (!ObjectId.isValid(id))
            throw new Error("Id is not a valid user profile in database");
         let farmer = await Farmer.findById(id);
         if (!farmer) throw new Error("Farmer not found with this id");
         farmer.password = undefined;
         JSONResponse.success(res, "Retrieved farmer info", farmer, 200);
      } catch (error) {
         JSONResponse.error(res, "Unable to find farmer", error, 404);
      }
   };
}

module.exports = FarmerController;
