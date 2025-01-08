/**
 * @swagger
 * tags:
 *  name: Authentication
 *  description: Auth module and routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          MobileOnlyRequest:
 *              type: object
 *              required: ["mobile"]
 *              properties:
 *                  mobile:
 *                      type: string
 *                      description: Mobile number following pattern 09XXXXXXXXX
 *                      example: 09123456789
 *          CheckOTPRequest:
 *              type: object
 *              required: ["mobile", "code"]
 *              properties:
 *                  mobile:
 *                      type: string
 *                      description: Mobile number following pattern 09XXXXXXXXX
 *                      example: 09123456789
 *                  code:
 *                      type: string
 *                      description: OTP code
 *                      example: "12345"
 *          OTPSuccessResponse:
 *              type: object
 *              properties:
 *                  statusCode:
 *                      type: number
 *                      example: 201
 *                  data:
 *                      type: object
 *                      properties:
 *                          code:
 *                              type: string
 *                              example: 12345
 *                          mobile:
 *                              type: string
 *                              example: 09123456789
 *          LoginSuccessResponse:
 *              type: object
 *              properties:
 *                  statusCode:
 *                      type: number
 *                      example: 200
 *                  data: 
 *                      type: object
 *                      properties:
 *                          accessToken:
 *                              type: string
 *                              example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *                          refreshToken:
 *                              type: string
 *                              example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *          ErrorResponse:
 *              type: object
 *              properties:
 *                  error:
 *                      type: object
 *                      properties:
 *                          statusCode:
 *                              type: number
 *                              example: 400
 *                          message:
 *                              type: string
 *                              example: invalid request parameters
 */



/**
 * @swagger
 * /auth/get-otp:
 *  post:
 *      summary: Request an OTP by providing a mobile number
 *      tags: [Authentication]
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schemas:
 *                      $ref: '#/components/schemas/MobileOnlyRequest'
 *              application/json:
 *                  schemas:
 *                      $ref: '#/components/schemas/MobileOnlyRequest'
 *      responses:
 *          201:
 *              description: otp created successfully
 *              content:
 *                  application/json:
 *                      schemas:
 *                          $ref: '#/components/schemas/OTPSuccessResponse'
 *          400:
 *              description: Bad Request
 *              content:
 *                  application/json:
 *                      schemas:
 *                          $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /auth/check-otp:
 *  post:
 *      summary: Verify the OTP code and log in
 *      tags: [Authentication]
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schemas:
 *                      $ref: '#/components/schemas/CheckOTPRequest'
 *              application/json:
 *                  schemas:
 *                      $ref: '#/components/schemas/CheckOTPRequest'
 *      responses:
 *          200:
 *              description: login success
 *              content:
 *                  application/json:
 *                      schemas:
 *                          $ref: '#/components/schemas/LoginSuccessResponse'
 *          400:
 *              description: Invalid OTP or other client error
 *              content:
 *                  application/json:
 *                      schemas:
 *                          $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /auth/refresh-token:
 *  post:
 *      summary: Refresh an expired access token
 *      tags: [Authentication]
 *      responses:
 *          200:
 *              description: token refreshed
 *              content:
 *                  application/json:
 *                      schemas:
 *                          $ref: '#/components/schemas/LoginSuccessResponse'
 *          401:
 *              description: Unauthorized - invalid or missing refresh token
 *              content:
 *                  application/json:
 *                      schemas:
 *                          $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /auth/logout:
 *  post:
 *      summary: Log out the user (invalidate current session)
 *      tags: [Authentication]
 *      responses:
 *          200:
 *              description: logout successful
 *              content:
 *                  application/json:
 *                      schemas:
 *                          type: object
 *                          properties:
 *                              statusCode:
 *                                  type: number
 *                                  example: 200
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: string
 *                                          example: successfully logged out
 *                          
 *          400:
 *              description: Bad request if user not logged in
 *              content:
 *                  application/json:
 *                      schemas:
 *                          $ref: '#/components/schemas/ErrorResponse'
 */

