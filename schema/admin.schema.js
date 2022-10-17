const {Schema, model} = require("mongoose");

adminSchema = new Schema({
    email: {type: String,required: [true,"An email is required to creaet and account"]},
    password: {type: String,required: [true,"Password is required"]},
    username: {type: String,required: [true,"Username is required"]}
});



adminSchema.pre("save", async function(next){
    try{
        if(!this.isModified('password')) return next(); 
        this.password = await bcrypt.hash(this.password,10);       
    }catch(error){
        return Promise.reject(new Error(error.message));
    }
    
});


adminSchema.post("save", async function(doc){
    doc = removeSensitiveFields(doc);
});

adminSchema.pre("findOneAndUpdate", async function(next){    
    try{
        if(this._update.password) {
            this._update.password = await bcrypt.hash(this._update.password, 10)
        }
    }catch(error){
        return Promise.reject(new Error(error.message));
    }
})


adminSchema.post(/^find/, async function(doc){
    if(Array.isArray(doc)){
        for(let file of doc){
            file = removeSensitiveFields(file);
        }
    }else {
        if(!doc) return Promise.reject(new Error("No File found"));

        // checks to see if the operation is findOne and if there is an email in the conditions
        if(!(this.op == "findOne" && this._conditions.email)) {
            doc = removeSensitiveFields(doc);

        }
    }
});


function removeSensitiveFields(doc){
    doc.password = undefined;   
    return doc
}
// Instance method to check for a password to compare a password with the encrypted password on the instance document.
adminSchema.methods.isCorrectPassword = async function(password){
    let isCorrect = await bcrypt.compare(password, this.password);
    return isCorrect;
}


module.exports = model("Admin", adminSchema);