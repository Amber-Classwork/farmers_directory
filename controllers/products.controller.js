const Product = require("../schema/products.schema");
const { JSONResponse } = require("../utilities/jsonResponse");
const { deleteObjectFromS3 } = require("../utilities/s3");

class ProductController {

    static createProduct = async(req, res, next)=>{
        try{
            let data = req.body;
            if(req.file){
                data.prod_img = req.file.location;
            }
            let product = await new Product(data).save();
            JSONResponse.success(res, "Successfully created product", product, 200);
        }catch(error){
            if(req.file){
                deleteObjectFromS3(req.file.location);
            }
            JSONResponse.error(res, "Unable to create products", error, 400);
        }
    }


    static getAllProducts = async(req, res, next)=>{
        try{
            let product = await Product.find();
            JSONResponse.success(res, "Successfully created product", product, 200);
        }catch(error){
            JSONResponse.error(res, "Unable to retrieve product", error, 404);
        }
    }

    static updateProduct = async(req, res, next)=>{
        try{
            let id = req.params.id;
            let data = req.body;
            if(req.file){
                data.prod_img = req.file.location;
            }
            let product = await Product.findOneAndUpdate({_id: id}, data, {new:true});
            JSONResponse.success(res, "Successfully updated product", product, 200);

        }catch(error){
            JSONResponse.error(res, "Unable to update product", error, 404);
        }
    }


    static deleteProduct = async(req, res, next)=>{
        try{
            let id = req.params.id;
            let product = await Product.findOneAndDelete({_id: id});
            JSONResponse.success(res, "Deleted Product successfully", product, 200);
        }catch(error){
            JSONResponse.error(res,"Unable to delete product", error, 404);
        }
    }

    static getProductById = async(req, res, next)=>{
        try{
            let id = req.params.id;
            let product = await Product.findById(id);
            JSONResponse.success(res, "Product successfully retrieved", product, 200);
        }catch(error){
            JSONResponse.success(res, "Failed to retrieve product", error, 404)
        }
    }

}

module.exports = ProductController;