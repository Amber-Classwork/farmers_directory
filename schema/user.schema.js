const {model, Schema} = require("mongoose");
const bcrypt = require("bcrypt");

/**
 * @openapi
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          properties:
 *              id:
 *                  type: mongoose object id as string
 *                  example: 63228ae60e8b432603389f39
 *              fname:
 *                  type: string
 *                  example: John
 *              lname:
 *                  type: string
 *                  example: Doe
 *              image:
 *                  type: string
 *                  example: john_doe_profile_img.jpg
 *              email:
 *                  type: string
 *                  example: jdoe65@mail.com
 *              password:
 *                  type: string
 *                  example: $3cUrePa$$0rd
 *              id_number:
 *                  type: string
 *                  example: A1234567
 *              phone:
 *                  type: string
 *                  example: 876-876-8765
 *              description:
 *                  type: string
 *                  example: This is an example of an introduction about me
 *              address:
 *                  type: Object
 *                  example: {
 *                            street: 124 Savvy Lane
 *                            street: Longville
 *                            street: St. Elizabeth
 *                          }
 *              socials:
 *                  type: Object
 *                  example: {
 *                            facebook: https://www.facebook.com/jane-doe
 *                            website: Janedoe@farmersmeet.com
 *                            instagram: https://www.instagram.com/j-doe
 *                          }
 *      
 * 
 */
const userSchema = new Schema({
    fname : {
        type: String, 
        unique: [true, "name already exist in the database"]
    }, 
    lname : {
        type: String, 
        required: [true, "Last name is a required field"]
    }, 
    image: {
        type: String
    },
    email: {
        type: String, 
        unique: [true, "Email already exist in the database"]
    },
    password: {
        type: String, 
        required: [true, "Password was not provided"]
    },
    description: {
        type: String, 
        
    },
    address: {
        street: {type: String, required:[true,"Street is required"]},
        city: {type: String, required:[true,"City is required"]},
        parish: {type: String, required:[true,"Parish is required"]}
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
    isSuperAdmin:{
        type: Boolean,
        default: false,
    }
   

});


// Middleware function to execute and hash password before saving user into the database.

userSchema.pre("save", async function(){
    try{
        this.password = await bcrypt.hash(this.password, 10);
        this.isSuperAdmin = false;
    }catch(error){
        return Promise.reject(new Error(error.message));
    }
    
});






userSchema.post("save", async function(doc){
    doc = removeSensitiveFields(doc);
});

userSchema.post("findOneAndUpdate", async function(doc,next){    
    try{

    doc.id_type = (doc.id_type) ?doc.id_type.toUpperCase():  undefined;
    doc = await doc.save();
    next()
    }catch(error){
        return Promise.reject(new Error(error.message));
    }
})


// had to do a bunch of acrobatics here. Not sure if it really is the best approach..highly doubt it. The latest condition is trying to zeroin on authenticating user to ensure that document password is not removed before it is processed;

userSchema.post(/^find/, async function(doc){
    if(Array.isArray(doc)){
        for(let file of doc){
            file = removeSensitiveFields(file);
        }
    }else {
        if(!doc) return Promise.reject(new Error("No File found"));
        if(!(this.op == "findOne" && this._conditions.username)) {
            doc = removeSensitiveFields(doc);

        }
    }
});


function removeSensitiveFields(doc){
    doc.isSuperAdmin = undefined;
    doc.password = undefined;   
    return doc
}
// Instance method to check for a password to compare a password with the encrypted password on the instance document.
userSchema.methods.isCorrectPassword = async function(password){
    let isCorrect = await bcrypt.compare(password, this.password);
    return isCorrect;
}

module.exports = model("User", userSchema);