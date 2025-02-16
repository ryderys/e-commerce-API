/**
 * @swagger
 * tags:
 *  name: Order
 *  description: Order module and routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          CreateOrder:
 *              type: object
 *              properties:
 *                  address:
 *                      type: string
 *                      example: "123 Main St"
 *                  city:
 *                      type: string
 *                      example: "New York"
 *                  state:
 *                      type: string
 *                      example: "NY"
 *                  zipCode:
 *                      type: string
 *                      example: "10001"
 *                  country:
 *                      type: string
 *                      example: "USA"
 *                  paymentMethod:
 *                      type: string
 *                      enum: ['credit_card', 'paypal']
 *                      example: "credit_card"
 *          OrderResponse:
 *              type: object
 *              properties:
 *                  statusCode:
 *                      type: number
 *                      example: 200
 *                  data: 
 *                      type: object
 *                      properties:
 *                          orders:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      id:
 *                                          type: string
 *                                          example: "67b0cf6c8d8af1c5651a0e5c"
 *                                      status:
 *                                          type: string
 *                                          example: "pending"
 *                                      createdAt:
 *                                          type: string
 *                                          example: "2025-02-15T17:31:24.818Z"
 *                                      totalAmount:
 *                                          type: number
 *                                          example: 100
 *                                      paymentMethod:
 *                                          type: string
 *                                          example: "credit_card"
 *                                      paymentStatus:
 *                                          type: string
 *                                          example: "pending"
 *                                      shippingInfo:
 *                                          type: object
 *                                          properties:
 *                                              address:
 *                                                  type: string
 *                                                  example: "123 Main St"
 *                                              city:
 *                                                  type: string
 *                                                  example: "new york"
 *                                              state:
 *                                                  type: string
 *                                                  example: "ny"
 *                                              zipcode:
 *                                                  type: string
 *                                                  example: "10001"
 *                                              country:
 *                                                  type: string
 *                                                  example: "usa"
 *                                      products:
 *                                          type: array
 *                                          items:
 *                                              type: object
 *                                              properties:
 *                                                  product:
 *                                                      type: object
 *                                                      properties:
 *                                                          id:
 *                                                              type: string
 *                                                              example: 678f7afccf41dd7a530013d8            
 *                                                          name:
 *                                                              type: string
 *                                                              example: "lv shirt"            
 *                                                          price:
 *                                                              type: string
 *                                                              example: 199
 *                                                          images:
 *                                                              type: array
 *                                                              items:
 *                                                                  type: string
 *                                                                  example: ["image1.png"]
 *                                                          quantity:
 *                                                              type: number
 *                                                              example: 2            
 *          Order:
 *              type: object
 *              properties:
 *                  id:
 *                      type: string
 *                  user:
 *                      type: string
 *                  products:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/OrderProduct'
 *                  totalAmount:
 *                      type: number
 *                  status:
 *                      type: string
 *                      enum: ["pending", "processing", "shipped", "delivered", "canceled"]
 *                  shippingInfo:
 *                      $ref: '#/components/schemas/ShippingInfo'
 *                  paymentStatus:
 *                      type: string
 *                      enum: ["pending", "completed", "failed", "refunded"]
 *                  paymentMethod:
 *                      type: string
 *                      enum: ["credit_card", "paypal"]
 *                  trackingNumber:
 *                      type: string
 *                  createdAt:
 *                      type: string
 *                      format: date-time
 *          OrderProduct:
 *              type: object
 *              properties:
 *                  product:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: string
 *                          name:
 *                              type: string
 *                          price:
 *                              type: number
 *                          images:
 *                              type: array
 *                              items:
 *                                  type: string
 *                  quantity:
 *                      type: number
 *                  price:
 *                      type: number
 *          ShippingInfo:
 *              type: object
 *              required: ["address", "city", "state", "zipCode", "country"]
 *              properties:
 *                  address:
 *                      type: string
 *                      example: "123 Main St"
 *                  city:
 *                      type: string
 *                      example: "New York"
 *                  zipCode:
 *                      type: string
 *                  country:
 *                      type: string
 *          Error:
 *              type: object
 *              properties:
 *                  status:
 *                      type: number
 *                  message:
 *                      type: string
 *  
 */

/**
 * @swagger
 * /order/create:
 *  post:
 *      summary: Create a new order from cart
 *      tags: [Order]
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateOrder'
 *      responses:
 *          201:
 *              description: Order created successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              order:
 *                                  $ref: '#/components/schemas/Order'
 *          400:
 *              description: Invalid Request Parameters
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref:  '#/components/schemas/Error'
 */

/**
 * @swagger
 * /order:
 *  get:
 *      summary: Get user's orders
 *      tags: [Order]
 *      responses:
 *          200:
 *              description:  List of user's orders
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/OrderResponse'
 *          401:
 *              description: unauthorized
 *          500:
 *              description: Internal Server Error
 */
/**
 * @swagger
 * /order/{orderId}:
 *  get:
 *      summary: Get order details
 *      tags: [Order]
 *      parameters:
 *          -   in: path
 *              name: orderId
 *              required: true
 *              schema:
 *                  type: string
 *              description: the id of the order
 *      responses:
 *          200:
 *              description:  Order details
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/OrderResponse'
 *          401:
 *              description: unauthorized
 *          500:
 *              description: Internal Server Error
 */



/**
 * @swagger
 * /order/{orderId}/cancel:
 *  patch:
 *      summary: Cancel an order
 *      tags: [Order]
 *      parameters:
 *          -   in: path
 *              name: orderId
 *              required: true
 *              schema:
 *                  type: string
 *              description: the id of the order
 *      responses:
 *          200:
 *              description:  Order canceled successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/OrderResponse'
 *          400:
 *              description: order cannot be canceled
 *          401:
 *              description: unauthorized
 *          500:
 *              description: Internal Server Error
 */