const {model, Schema} = require("mongoose");
const bcrypt = require("bcrypt");

const farmerSchema = new Schema({
    fname : {
        type: String, 
        unique: [true, "name already exist in the database"]
    }, 
    lname : {
        type: String, 
        required: [true, "Last name is a required field"]
    }, 
    farmer_type:{
        type: String, 
    },
    image: {
        type: String
    },
    email: {
        type: String, 
        unique: true,
        required: [true,"Email must be provided"],
        lowercase: true

    },
    password: {
        type: String, 
        required: [true, "Password was not provided"]
    },
    description: {
        type: String, 
        
    },
    address: {
        street: {type: String},
        city: {type: String},
        parish: {type: String}
    },
    socials: {
        website: {type: String},
        facebook: {type: String},
        instagram: {type: String},
    },
    phone: {type: String},

    id_number: {
        type: String,
        required: [true, "ID must be present in order to be valid"]
    },
    products: [{type:Schema.Types.ObjectId, ref:"Product"}]

});


// Middleware function to execute and hash password before saving user into the database.

farmerSchema.pre("save", async function(next){
    try{
        if(!this.isModified('password')) return next(); 
        this.password = await bcrypt.hash(this.password,10);       
        this.isSuperAdmin = false;
    }catch(error){
        return Promise.reject(new Error(error.message));
    }
    
});


farmerSchema.post("save", async function(doc){
    doc = removeSensitiveFields(doc);
});

farmerSchema.pre("findOneAndUpdate", async function(next){    
    try{
        if(this._update.password) {
            this._update.password = await bcrypt.hash(this._update.password, 10)
        }if(this._update.image){
            getDocumentFromQueryAndDeleteImage(this);
        }
    }catch(error){
        return Promise.reject(new Error(error.message));
    }
});





// had to do a bunch of acrobatics here. Not sure if it really is the best approach..highly doubt it. The latest condition is trying to zeroin on authenticating user to ensure that document password is not removed before it is processed;

farmerSchema.post(/^find/, async function(doc){
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

async function getDocumentFromQueryAndDeleteImage(query){
    let doc = await query.model.findOne(query.getQuery());
    if (!doc) return Promise.reject(new Error("No user found with this ID"));
    
    if(doc.image){
        await deleteObjectFromS3(doc.image)
    }
}

function removeSensitiveFields(doc){
    doc.isSuperAdmin = undefined;
    doc.password = undefined;   
    return doc
}
// Instance method to check for a password to compare a password with the encrypted password on the instance document.
farmerSchema.methods.isCorrectPassword = async function(password){
    let isCorrect = await bcrypt.compare(password, this.password);
    return isCorrect;
}


module.exports = model("Farmer", farmerSchema);