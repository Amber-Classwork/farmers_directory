const Category = require("../schema/category.schema");
const { JSONResponse } = require("../utilities/jsonResponse");


class CategoryController {

    static getAllCategories = async(req, res, next)=>{
        try{
            let categories = await Category.find();
            JSONResponse.success(res, "Successfully retrieved categories", categories, 200);
        }catch(error){
            JSONResponse.error(res, "Unable to retrieve categories", error, 404);
        }
    }

    static getCategoryById = async (req, res, next)=>{
        try{
            let id = req.params.id;
            let category = await findById(id);
            JSONResponse.success(res, "Successfully retrieved category", category, 200)
        }catch(error){
            JSONResponse.error(res, "Unable to retrieve category", error, 404);
        }
    }

    static createCategory = async(req, res,next)=>{
        try{
            let data = req.body;
            let category = await new Category(data).save();
            JSONResponse.success(res, "Successfully created category", category, 201);
        }catch(error){
            JSONResponse.error(res, "Unable to create category", error, 404);
        }
    }

    static updateCategory = async(req, res, next)=>{
        try{
            let data = req.body;
            let id = req.params.id;
            let category = await Category.findByIdAndUpdate(id, data, {new:true});
            JSONResponse.success(res, "Successfully updated category", category, 200);
        }catch(error){
            JSONResponse.error(res, "Unable to update category", error, 404);
        }
    }


    static deleteCategory = async(req,res, next)=>{
        try{
            let id = req.params.id;
            let category = await Category.findByIdAndDelete(id);
            JSONResponse.success(res,"Successfully deleted category", category, 200);
        }catch{
            JSONResponse.error(res, "Unable to delete category", error, 404)
        }
    }
}



module.exports = CategoryController;