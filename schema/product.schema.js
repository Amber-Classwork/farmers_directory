const { Schema, model } = require("mongoose");
const { deleteObjectFromS3 } = require("../utilities/s3");


const productSchema = new Schema({

    prod_name: {type: String, required: [true,"Product name is a required property"]},
    prod_img: {type: String},
    seller: {type: Schema.Types.ObjectId, ref:"User"},
    category:{
        type: Schema.Types.ObjectId, ref: "Category"
    },

});


productSchema.pre("save", function(next){
    // checks the data before save to ensure that it is not empty besides _id and __v property;
    console.log(this) 
    if(Object.keys(this).length <= 1 ){
        return Promise.reject("Please provide data to create Product");
    }
    next();
});
productSchema.post(/^find/, function(doc){

    if(!Array.isArray(doc)) return;

    // If doc is null then return error to controller
    if(!doc){
        return Promise.reject( new Error("No product present with that name"));
    }

});

productSchema.pre("findOneAndDelete", async function( next){
    await getDocumentFromQueryAndDeleteImage(this)
    next()
 
});

productSchema.pre("findOneAndUpdate", async function(){
    await getDocumentFromQueryAndDeleteImage(this);
})


async function getDocumentFromQueryAndDeleteImage(query){
    let doc = await query.model.findOne(query.getQuery());
    if (!doc) return Promise.reject(new Error("No user found with this ID"));
    
    if(doc.prod_img){
        await deleteObjectFromS3(doc.prod_img)
    }
}

module.exports = model("Product", productSchema);