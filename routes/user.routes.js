const router = require('express').Router();
const UserController = require('../controllers/user.controller');
const Middleware = require('../middlewares/middleware');

router
    .route("/")
        /**
     * @openapi
     * /api/v1/users:
     *  get:
     *      tags:
     *          - Users
     *      responses:
     *          200:
     *              description: SUCCESS
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              status: 
     *                                  type: string
     *                                  example: Retrieved all users successfully
     */
    .get(Middleware.isAuthenticated,Middleware.isSuperAdmin,UserController.getAllUsers)

    /**
     * @openapi
     * /api/v1/users:
     *  post:
     *      summary: Create a new user profile
     *      tags:
     *          - Users
     *      requestBody:
     *          description: Form data required to create a new user
     *          required: true
     *          content:
     *              application/json:                   
     *                  schema:
     *                      $ref: "#/components/schemas/User"
     *      responses:
     *          200:
     *              description: SUCCESS
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              status:
     *                                  type: string
     *                                  example: User profile successfully created
     *                              data:
     *                                  type: object
     *                                  properties:
     *                                      user:
     *                                          type: object
     *                                          $ref: "#/components/schemas/User"
     *          
     *          400:
     *              description: FAILED
     *              content: 
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties: 
     *                              status: 
     *                                  type: string
     *                                  example: 400
     *                              message: 
     *                                  type: string
     *                                  example: Bad Request
     *                              error:
     *                                  type: string
     *                                  example: Error creating user profile                           
     *         
     *          5XX:
     *              description: FAILED
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              status:
     *                                  type: string
     *                                  example: FAILED
     *                              data:
     *                                  type: object
     *                                  properties:
     *                                          error:
     *                                              type: string
     *                                              example: Server error
     *
     *                  
     */
    .post(UserController.createUserProfile)
    
router
    .route("/:id")

    /**
     * @openapi
     * /api/v1/users/{id}:
     *  get:
     *      summary: Retrieve a user profile
     *      tags:
     *          - Users
     *      requestBody: 
     *          description: Form data required to access a user profile
     *          required: true
     *          content:
     *                application/json:
     *                  schema:
     *                      $ref: "#/components/schemas/User"
     *      responses:
     *          200:
     *              description: SUCCESS
     *              content: 
     *                  application/json:
     *                         schema:
     *                            type: object
     *                            properties:
     *                                status:
     *                                   type: string
     *                                   example: Retrieved user info
     *                                data:
     *                                   type: object
     *                                   properties:
     *                                         user:
     *                                              type: object
     *                                              #ref: "#/components/schemas/User"
     * 
     *          400:
     *              description: FAILED
     *              content: 
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties: 
     *                              status: 
     *                                  type: string
     *                                  example: 404
     *                              message: 
     *                                  type: string
     *                                  example: Bad Request
     *                              error:
     *                                  type: string
     *                                  example: Error retrieving user profile
     * 
     *          5XX:
     *              description: FAILED
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              status:
     *                                  type: string
     *                                  example: FAILED
     *                              data:
     *                                  type: object
     *                                  properties:
     *                                          error:
     *                                              type: string
     *                                              example: Server error   
     * 
     */
    .get(UserController.getUserProfile)

    /**
     *  @openapi
     *  /api/v1/users/{id}:
     *     patch:
     *          summary: Update a user profile
     *          tags:
     *                      - Users
     *          requestBody:
     *                      description: Form data required to update a current user
     *                      required: true
     *                      content:
     *                                application/json:
     *                                               schema:
     *                                                      $ref: "#/components/schemas/User"
     *          responses:
     *                      200:
     *                              description: SUCCESS
     *                              content:
     *                                          application/json:
     *                                                              schema:
     *                                                                      type: object
     *                                                                      properties:
     *                                                                                  status:
     *                                                                                          type: string
     *                                                                                          example: User updated successfully
     *                                                                                  data:
     *                                                                                          type: object
     *                                                                                          properties:
     *                                                                                                      user:
     *                                                                                                              type: object
     *                                                                                                              $ref: "#/components/schemas/User"
     * 
     *                      400:
     *                              description: FAILED
     *                              content:
     *                                          application/json:
     *                                                              schema:
     *                                                                      type: object
     *                                                                      properties:
     *                                                                                  status:
     *                                                                                          type: string
     *                                                                                          example: 404
     *                                                                                  message:
     *                                                                                          type: string
     *                                                                                          example: Bad Request
     *                                                                                  error:
     *                                                                                          type: string
     *                                                                                          example: Unable to update user profile
     * 
     *                      5XX:
     *                              description: FAILED
     *                              content:
     *                                          application/json:
     *                                                              schema:
     *                                                                      type: object
     *                                                                      properties:
     *                                                                                  status:
     *                                                                                          type: string
     *                                                                                          example: FAILED
     *                                                                                  data:
     *                                                                                          type: object
     *                                                                                          properties:
     *                                                                                                      error:
     *                                                                                                              type: string
     *                                                                                                              example: Server error
     */
    .patch(UserController.updateUserProfile)

    /**
     *  @openapi
     *  /api/v1/users/{id}:
     *      delete:
     *              summary: Delete a user profile
     *              tags:
     *                          - Users
     *              requestBody:
     *                          description: Form data required to pick a user profile for deletion
     *                          required: true
     *                          content:
     *                                    application/json:
     *                                                      schema:
     *                                                              $ref: "#/components/schemas/User"
     * 
     *              responses:
     *                          200:
     *                                  description: SUCCESS
     *                                  content:
     *                                              application/json:
     *                                                                  schema:
     *                                                                          type: object
     *                                                                          properties:
     *                                                                                      status:
     *                                                                                              type: string
     *                                                                                              example: Successfully deleted user
     *                                                                                      data: 
     *                                                                                              type: object
     *                                                                                              properties:
     *                                                                                                          user:
     *                                                                                                                  type: object
     *                                                                                                                  $ref: "#/components/schemas/User"
     *                          
     *                          400:
     *                              description: FAILED
     *                              content:
     *                                          application/json:
     *                                                              schema:
     *                                                                      type: object
     *                                                                      properties:
     *                                                                                  status:
     *                                                                                          type: string
     *                                                                                          example: 404
     *                                                                                  message:
     *                                                                                          type: string
     *                                                                                          example: Bad Request
     *                                                                                  error:
     *                                                                                          type: string
     *                                                                                          example: Unable to delete user
     * 
     *                          5XX:
     *                              description: FAILED
     *                              content:
     *                                          application/json:
     *                                                              schema:
     *                                                                      type: object
     *                                                                      properties:
     *                                                                                  status:
     *                                                                                          type: string
     *                                                                                          example: FAILED
     *                                                                                  data:
     *                                                                                          type: object
     *                                                                                          properties:
     *                                                                                                      error:
     *                                                                                                              type: string
     *                                                                                                              example: Server error
     *  
     */
    .delete(UserController.deleteUserProfile)
    
module.exports = router;