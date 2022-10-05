const router = require('express').Router()
const AuthController = require('../controllers/auth.controller');

router
    .route("/")
    /**
     * @openapi
     * /api/v1/authenticate/:
     *  post:
     *      summary: Authenticates a user
     *      tags:
     *          - Auth
     *      requestBody:
     *          description: Data from login form
     *          required:  true
     *          content:    
     *              application/json:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          username:
     *                              type: string
     *                              example: jdoe95
     *                          password:
     *                              type: string
     *                              example: $3cuR3Pa$$w0Rd
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
     *                                  example: 200
     *                              data:
     *                                  type: object
     *                                  properties:
     *                                      user:
     *                                          type: object
     *                                          $ref: '#/components/schemas/User'
     *                                      token:
     *                                          type: string
     *                                          example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjMyMjRjNWVjMDYyNzM2ZjQ4Njg2YTMwIiwiaWF0IjoxNjYzNzI5NTAzLCJleHAiOjE2NjM3MzEzMDN9.cWc0bEDMz-lWaP9bVgv9plPZ2sfh-8iY6HiyBWAbIGA
     *          401:
     *              description: FAILED
     *              content: 
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
*                                  status: 
*                                      type: string
*                                      example: 401
*                                  error:
*                                      type: string
*                                      example: User not authenticated
     *                              
     *                              
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
     *                              error:
     *                                  type: string
     *                                  example: Server Error
     *                                  
     *   
     */
    .post(AuthController.authenticate);

module.exports = router;