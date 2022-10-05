const User = require("../schema/user.schema");
const { JSONResponse } = require("../utilities/jsonResponse");
const { generateJWTToken } = require("../utilities/tokenGenerator");

class AuthController {
   static authenticate = async (req, res, next) => {
      try {
         let { email, password } = req.body;
         let user = await User.findOne({ email: email });
         if (!user)
            throw new Error("No user present which matches the email");
         let passCheck = await user.isCorrectPassword(password);
         if (!passCheck) throw new Error("Invalid password");
         let data = user;
         data.password = undefined;
         data.isSuperAdmin = undefined;
         let token = generateJWTToken(
            { id: user._id, email: user.email, isSuperAdmin: user.isSuperAdmin},
            "3600"
         );

         JSONResponse.success(
            res,
            "User is authenticated successfully",
            { user, token },
            200
         );
      } catch (error) {
         JSONResponse.error(res, "User not Authenticated", error, 401);
      }
   };
}

module.exports = AuthController;
