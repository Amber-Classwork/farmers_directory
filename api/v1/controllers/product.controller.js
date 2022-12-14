const Product = require("../../../schema/product.schema");
const { JSONResponse } = require("../../../utilities/jsonResponse");
const awsStorage = require("../../../utilities/s3.utility");

class ProductController {

    static createProduct = async(req, res, next)=>{
        try{
            let data = req.body;
            if(req.file){
                data.prod_img = req.file.location;
            }
            let product = await (await new Product(data).save());
            JSONResponse.success(res, "Successfully created product", product, 200);
        }catch(error){
            if(req.file){
                awsStorage.deleteObjectFromS3(req.file.location);
            }
            JSONResponse.error(res, "Unable to create products", error, 400);
        }
    }


    static getAllProducts = async(req, res, next)=>{
        try{
            let product = await Product.find();
            if(req.query.categoryID){
                return getProductsByCategory(req, res, req.query.categoryID)
            }else if(Object.keys(req.query).length > 0) throw new Error("Not a valid query parameters");
            JSONResponse.success(res, "Successfully created product", product, 200);
        }catch(error){
            JSONResponse.error(res, "Unable to retrieve product", error, 404);
        }
    }

    static updateProduct = async(req, res, next)=>{
        try{
            let id = req.params.id;
            let data = req.body;
            data.prod_img = (req.file) ? req.file.location : undefined;
            let product = await Product.findById(id);
            if(!product) throw new Error("Product not found");
            if(data.prod_img && product.prod_img){
               await awsStorage.deleteObjectFromS3(product.prod_img);
            };
            product = await Product.findOneAndUpdate({_id: id}, data, {new:true});
            JSONResponse.success(res, "Successfully updated product", product, 200);

        }catch(error){
            JSONResponse.error(res, "Unable to update product", error, 404);
        }
    }


    static deleteProduct = async(req, res, next)=>{
        try{
            let id = req.params.id;
            let product = await Product.findById(id);
            if(!product) throw new Error("Product not found with that ID");

            if(product.prod_img){
                await awsStorage.deleteObjectFromS3(product.prod_img);
             };
            product = await Product.findOneAndDelete({_id: id});
            JSONResponse.success(res, "Deleted Product successfully", product, 200);
        }catch(error){
            JSONResponse.error(res,"Unable to delete product", error, 404);
        }
    }

    static getProductById = async(req, res, next)=>{
        try{
            let id = req.params.id;
            let product = await Product.findById(id);
            if(!product) throw new Error("Product not found with that ID")
            JSONResponse.success(res, "Product successfully retrieved", product, 200);
        }catch(error){
            JSONResponse.success(res, "Failed to retrieve product", error, 404)
        }
    }

    static getProductsByCategory = async(req, res, categoryID)=>{
        try{
            if(categoryID){
                let products = await Product.find({category: categoryID});
                JSONResponse.success(res, "Products successfully retrieved", products, 200);
            }
            
        }catch(error){
            JSONResponse.success(res, "Failed to retrieve products", error, 404)
        }
    }

}

module.exports = ProductController;