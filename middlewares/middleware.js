const { JSONResponse } = require("../utilities/jsonResponse");
const JWT = require("jsonwebtoken");
const Admin = require("../schema/admin.schema");
class Middleware{

    /**
     * ### Description
     * Gets the requests then checks to ensure therer is a authorization header present. If there is it gets the token and assigns it to the request as a token property.
     * @param {Request} req 
     * @param {Response} res 
     * @param {*} next 
     */
    static isAuthenticated = async (req, res, next) => {
        try{
            const bearerHeader = req.headers['authorization'];
            
            if (bearerHeader) {
                const bearer = bearerHeader.split(' ');
                const bearerToken = bearer[1];
                req.token = bearerToken;
                let decodedToken = JWT.verify(bearerToken, process.env.JWT_SECRET_KEY);
                req.user = decodedToken;
                next();
            } else {
                // Forbidden
                JSONResponse.error(res, "Unauthorized Access Attempted","Access Denied", 403);        }
        }catch(error){
            JSONResponse.error(res, "Unauthorized Access Attempted",error, 403); 
        }
    }
    static isAdmin = async (req, res, next)=>{
        try{
            if(req.user){
                let admins = await Admin.find({_id: req.user.id});
    
                if(admins.length == 0){
                    throw new Error("User is not an admin"); 
                }
                next()
            }else{
                throw new Error("This user is not an admin");
            }
        }catch(error){
            JSONResponse.error(res, "Unauthorized Access Attempted", error, 403);
        }
    }

    static isUserOrAdmin = (req, res, next)=>{
        if(req.params.id != req.user.id){
            return this.isAdmin(req, res,next);
        }else{
            next();
        }
    }

    
}

module.exports = Middleware;