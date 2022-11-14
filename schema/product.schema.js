const { Schema, model } = require("mongoose");
const { deleteObjectFromS3 } = require("../utilities/s3.utility");


const productSchema = new Schema({

    prod_name: {type: String, required: [true,"Product name is a required property"], unique: true},
    prod_img: {type: String},
    category:{
        type: Schema.Types.ObjectId, ref: "Category"
    },
    inSeason: {type: Boolean, default: false}

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

productSchema.methods.checkDupe = function () {
	return new Promise(async (resolve, reject) => {
		const dupe = await model('Product')
			.find({ prod_name: this.prod_name})
			.catch((err) => {
				reject(err)
			})
		resolve(dupe.length > 0)
	})
}

module.exports = model("Product", productSchema);