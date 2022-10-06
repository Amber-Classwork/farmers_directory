const {Schema, model} = require("mongoose");

const categorySchema = new Schema({
    category_name: {
        type: String, required:[true,"A category name needs to be provided"]
    }
});



categorySchema.pre("save", function(next){
    // checks the data before save to ensure that it is not empty;
    if(Object.keys(this).length == 0 ){
        return Promise.reject("Please provide data to create category");
    }
})
categorySchema.post(/^find/, function(doc){

    if(!Array.isArray(doc)) return;

    // If doc is null then return error to controller
    if(!doc){
        return Promise.reject( new Error("No category present with that name"));
    }

});

module.exports = model("Category", categorySchema);
