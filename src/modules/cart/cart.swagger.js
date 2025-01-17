/**
 * @swagger
 * tags:
 *  name: Cart
 *  description: Cart module and routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          AddToCartReq:
 *              type: object
 *              required: ["productId", "quantity"]
 *              properties:
 *                  productId:
 *                      type: string
 *                      description: ID of the product to add to the cart
 *                      example: "607f1f77bcf86cd799439011"
 *                  quantity:
 *                      type: number
 *                      description: Quantity of the product to add
 *                      example: 2
 *          CartItem:
 *              type: object
 *              properties:
 *                  id:
 *                      type: string
 *                      description: unique identifier for the cart item
 *                      example: "60d0fe4f5311236168a109ca"
 *                  productId:
 *                      type: string
 *                      description: ID of the product
 *                      example: "607f1f77bcf86cd799439011"
 *                  quantity:
 *                      type: number
 *                      description: Quantity of the product in the cart
 *                      example: 2
 *                  productName:
 *                      type: string
 *                      description: the name of the product
 *                      example: "sample product"
 *                  productPrice:
 *                      type: number
 *                      description: price of product
 *                      example: 19.99
 *          CartResponse:
 *              type: object
 *              properties:
 *                  _id:
 *                      type: string
 *                      example: "60d0fe4f5311236168a109ca"
 *                  userId:
 *                      type: string
 *                      example: "609e128f8f1b2c3456789abc"
 *                  items:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/CartItem'
 *                  expiresAt:
 *                      type: string
 *                      format: date-time
 *          CartData:
 *              type: object
 *              properties:
 *                  cart:
 *                      $ref: '#/components/schemas/CartResponse'
 *                  message:
 *                      type: string
 *                      example: "Item added to cart successfully"
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
 *                              example: "Invalid Request Parameters"
 *          PublicResponse:
 *              type: object
 *              properties:
 *                  statusCode:
 *                      type: number
 *                      example: 200
 *                  data:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              example: "successful" 
 */

/**
 * @swagger
 * /cart/add-item:
 *  post:
 *      summary: Add an item to the cart
 *      tags: [Cart]
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/AddToCartReq'
 *      responses:
 *          200:
 *              description: item added to cart successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/PublicResponse'
 *          400:
 *              description: Bad Request or insufficient stock
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /cart/remove-item/{productId}:
 *  delete:
 *      summary: Remove an item to the cart
 *      tags: [Cart]
 *      parameters:
 *          -   in: path
 *              name: productId
 *              required: true
 *              schema:
 *                  type: string
 *              description: ID of the product to remove from the cart
 *      responses:
 *          200:
 *              description: item removed from cart successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/PublicResponse'
 *          400:
 *              description: Bad Request - item not in cart
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /cart:
 *  get:
 *      summary: Retrieve the current user's cart
 *      tags: [Cart]
 *      responses:
 *          200:
 *              description: Cart retrieved successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusCode:
 *                                  type: umber
 *                                  example: 200
 *                              data:
 *                                  $ref: '#/components/schemas/CartData'
 *          404:
 *              description: cart not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 */