/**
 * @swagger
 * tags:
 *  name: User
 *  description: User module and routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          updateProfileSchema:
 *              type: object
 *              properties:
 *                  fullName:
 *                      type: string
 *                      example: "john doe"
 *                      description: user's fullname
 *                  username:
 *                      type: string
 *                      example: "john22"
 *                      description: user's username
 *                  email:
 *                      type: string
 *                      example: "test@gmail.com"
 *                      description: user's email
 *          updateProfileResponse:
 *              type: object
 *              properties:
 *                  statusCode:
 *                      type: number
 *                      example: 200
 *                  data:
 *                      type: object
 *                      properties:
 *                          user:
 *                              type: object
 *                              properties:
 *                                  _id:
 *                                      type: string
 *                                      example: "67b8c58208737afbf7bee77e"
 *                                  mobile:
 *                                      type: string
 *                                      example: "09123456789"
 *                                  verifiedMobile: 
 *                                      type: boolean
 *                                      example: true
 *                                  email: 
 *                                      type: string
 *                                      example: "test@test.com"
 *                                  username: 
 *                                      type: string
 *                                      example: "john34"
 *                                  fullname: 
 *                                      type: string
 *                                      example: "john doe"
 *                                  createdAt: 
 *                                      type: string
 *                                      format: date-time
 *                                      example: "2025-02-21T18:27:14.332Z"
 *                                  updatedAt: 
 *                                      type: string
 *                                      format: date-time
 *                                      example: "2025-02-21T18:27:14.332Z"
 *                          message:
 *                              type: string
 *                              example: "profile updated"
 *    
 */

/**
 * @swagger
 * /user/me:
 *  get:
 *      summary: get user profile
 *      tags: [User]
 *      responses:
 *          200:
 *              description: user details 
 *          404:
 *              description: user not found
 */


/**
 * @swagger
 * /user/all:
 *  get:
 *      summary: get all users
 *      tags: [User]
 *      responses:
 *          200:
 *              description: list of users
 *          404:
 *              description: user not found
 */

/**
 * @swagger
 * /user/me:
 *  patch:
 *      summary: update user profile
 *      tags: [User]
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/updateProfileSchema'
 *      responses:
 *          200:
 *              description: profile details
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/updateProfileResponse'
 *      
 */



