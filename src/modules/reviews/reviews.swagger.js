/**
 * @swagger
 * tags:
 *  name: Review
 *  description: Review module and routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          Review:
 *              type: object
 *              required: ["rating", "comment"]
 *              properties:
 *                  rating:
 *                      type: number
 *                      description: rating of the product
 *                      example: 3
 *                  comment:
 *                      type: string
 *                      description: comment for the product
 *                      example: "this was an awesome product"
 *          ReviewResponse:
 *              type: object
 *              properties:
 *                  _Id:
 *                      type: string
 *                      example: "67a0779d8fdbce4da345c342"
 *                  userId:
 *                      type: string
 *                      example: "6782b8530cbb934e82ba17f4"
 *                  productId:
 *                      type: string
 *                      example: "678f7afccf41dd7a530013d8"
 *                  rating:
 *                      type: string
 *                      example: 2
 *                  comment:
 *                      type: string
 *                      example: "Excellent product quality!"
 *                  createdAt:
 *                      type: string
 *                      format: date-time
 *                      example: "2023-10-01T12:34:56Z"
 *                  updatedAt:
 *                      type: string
 *                      format: date-time
 *                      example: "2023-10-01T12:34:56Z"
 *          UpdateReviewResponse:
 *              type: object
 *              properties:
 *                  _Id:
 *                      type: string
 *                      example: "67a0779d8fdbce4da345c342"
 *                  userId:
 *                      type: string
 *                      example: "6782b8530cbb934e82ba17f4"
 *                  productId:
 *                      type: string
 *                      example: "678f7afccf41dd7a530013d8"
 *                  rating:
 *                      type: number
 *                      example: 2
 *                  comment:
 *                      type: string
 *                      example: "Excellent product quality!"
 *                  edited:
 *                      type: boolean
 *                      example: true
 *                  editHistory:
 *                      type: object
 *                      properties:
 *                          rating:
 *                              type: number
 *                              example: 2
 *                          comment:
 *                              type: string
 *                              example: updated comment
 *                          _id:
 *                              type: string
 *                              example: 67a0dea14803d607bbb1bfb3
 *                  createdAt:
 *                      type: string
 *                      format: date-time
 *                      example: "2023-10-01T12:34:56Z"
 *                  updatedAt:
 *                      type: string
 *                      format: date-time
 *                      example: "2023-10-01T12:34:56Z"
 *          GetReviewsResponse:
 *              type: array
 *              items:
 *                  type: object
 *                  properties:
 *                      _Id:
 *                          type: string
 *                          example: "67a0779d8fdbce4da345c342"
 *                      userId:
 *                          type: object
 *                          properties:
 *                              _id:
 *                                  type: string
 *                                  example: "6782b8530cbb934e82ba17f4"
 *                              mobile:
 *                                  type: string
 *                                  example: "09123456789"
 *                              name:
 *                                  type: string
 *                                  example: "john"
 *                              email:
 *                                  type: string
 *                                  example: "test@gmail.com"
 *                      productId:
 *                          type: string
 *                          example: "678f7afccf41dd7a530013d8"
 *                      rating:
 *                          type: string
 *                          example: 2
 *                      comment:
 *                          type: string
 *                          example: "Excellent product quality!"
 *                      createdAt:
 *                          type: string
 *                          format: date-time
 *                          example: "2023-10-01T12:34:56Z"
 *                      updatedAt:
 *                          type: string
 *                          format: date-time
 *                          example: "2023-10-01T12:34:56Z"
 */

/**
 * @swagger
 * /review/products/{productId}:
 *  post:
 *      summary: add a product review
 *      tags: [Review]
 *      parameters:
 *          -   in: path
 *              name: productId
 *              required: true
 *              schema:
 *                  type: string
 *              description: ID of the product
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/Review'
 *      responses:
 *          201:
 *              description: Review created successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ReviewResponse'
 *          400:
 *              description: Invalid input or already reviewed
 *          401:
 *              description: Unauthorized - Missing or invalid token
 *          500:
 *              description: Server error
 */
/**
 * @swagger
 * /review/products/{reviewId}:
 *  put:
 *      summary: update a product review
 *      tags: [Review]
 *      parameters:
 *          -   in: path
 *              name: reviewId
 *              required: true
 *              schema:
 *                  type: string
 *              description: ID of the review
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/Review'
 *      responses:
 *          201:
 *              description: Review updated successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UpdateReviewResponse'
 *          400:
 *              description: Invalid input or already reviewed
 *          401:
 *              description: Unauthorized - Missing or invalid token
 *          500:
 *              description: Server error
 */

/**
 * @swagger
 * /review/products/{productId}:
 *  get:
 *      summary: Get all reviews for a specific product
 *      tags: [Review]
 *      parameters:
 *          -   in: path
 *              name: productId
 *              required: true
 *              schema:
 *                  type: string
 *              description: ID of the product
 *      responses:
 *          200:
 *              description: list of reviews
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetReviewsResponse'
 *          500:
 *              description: Internal Server Error
 */

/**
 * @swagger
 * /review/products/{reviewId}:
 *  delete:
 *      summary:  Delete a review
 *      tags: [Review]
 *      parameters:
 *          -   in: path
 *              name: reviewId
 *              required: true
 *              schema:
 *                  type: string
 *              description: ID of the review to delete
 *      responses:
 *          200:
 *              description: Review deleted successfully
 *          401:
 *              description: Unauthorized - Missing or invalid token
 *          404:
 *              description: review not found
 *          500:
 *              description: Server error
 */


