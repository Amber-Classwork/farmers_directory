const Farmer = require("../../../schema/farmer.schema");
const { JSONResponse } = require("../../../utilities/jsonResponse");
const { generateJWTToken } = require("../../../utilities/tokenGenerator");
const { ObjectId } = require("mongoose").Types;
const awsStorage = require("../../../utilities/s3.utility");
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
            { farmer:farmer.populate("products"), token },
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
         if(req.query.productID){
            return this.getFarmersByProduct;
         }else if(Object.keys(req.query) > 0) throw new Error("Incorrect query parameter")
         let farmer = await Farmer.find().populate("products");
         JSONResponse.success(res,"Retrieved all Farmers successfully",farmer,201);
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
            data.image = (req.file) ? req.file.location : undefined;
            let farmer = await (await new Farmer(data).save()).populate("products");
            farmer.password = undefined;
            JSONResponse.success(res, "Farmer profile successfully created",farmer, 201);
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
            if(data.email) data.email = data.email.toLowerCase();
            data.image = (req.file) ? req.file.location : undefined;
            let farmer = await Farmer.findById(id);
            
            if(!farmer) throw new Error("Farmer not found with the ID");
            if(farmer.image && data.image){
               await awsStorage.deleteObjectFromS3(farmer.image);
            };
            if(data.products && data.products.contains("[") && data.products.contains("]")){
               data.products = JSON.parse(data.products);
            }

            if(data.products && Array.isArray(data.products)){

               data.products.forEach((product)=>{
                  if(farmer.products){
                     if(!farmer.products.includes(product)){
                        farmer.products.push(product);
                     }
                  }else{
                     farmer.products = data.products
                  }
               });
            }else if(data.products && farmer.products){
               if(!farmer.products.includes(data.products)){
                  farmer.products.push(data.products);
               }
            }
            farmer = await Farmer.findByIdAndUpdate(id, data, {new: true}).populate("products");
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
         let farmer = await Farmer.findById(id);
         if(farmer.image){
            await awsStorage.deleteObjectFromS3(farmer.image);
         };
         farmer = await Farmer.findByIdAndDelete(id).populate("products");
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
         let farmer = await Farmer.findById(id).populate("products");
         if (!farmer) throw new Error("Farmer not found with this id");
         farmer.password = undefined;
         JSONResponse.success(res, "Retrieved farmer info", farmer, 200);
      } catch (error) {
         JSONResponse.error(res, "Unable to find farmer", error, 404);
      }
   };

   static getFarmersByProduct = async (req, res, next, productID) => {
      try{
         let farmers = await Farmer.find({_id: productID});
         JSONResponse.success(res, "Retrieved farmers that matches product",farmer, 200);
      }catch(error){
         JSONResponse.error(res,"Unable to retrieve Farmers", error, 404);
      }
   }
}

module.exports = FarmerController;
