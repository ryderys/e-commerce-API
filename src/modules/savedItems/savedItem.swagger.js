/**
 * @swagger
 * tags:
 *  name: SaveItem
 *  description: SaveItem module and routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          SaveItemResponse:
 *              type: object
 *              properties:
 *                  statusCode:
 *                      type: number
 *                      example: 200
 *                  data:
 *                      type: object
 *                      properties:
 *                          savedItems:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      product:
 *                                          type: object
 *                                          properties:
 *                                              id:
 *                                                  type: string
 *                                                  example: "679a32825b48073152345692"
 *                                              title:
 *                                                  type: string
 *                                                  example: "product title"
 *                                              summary:
 *                                                  type: string
 *                                                  example: "product summary"
 *                                              description:
 *                                                  type: string
 *                                                  example: "product description"
 *                                              tags:
 *                                                  type: array
 *                                                  items:
 *                                                      type: string
 *                                                      example: ["tag1", "tag2"]
 *                                              categoryId: 
 *                                                  type: string
 *                                                  example: "6783fb4a21656fb4f2231dc0"
 *                                              price: 
 *                                                  type: number
 *                                                  example: 99.99
 *                                              count:
 *                                                  type: number
 *                                                  example: 2
 *                                              images:
 *                                                  type: array
 *                                                  items:
 *                                                      type: string
 *                                                      example: ["image1.jpg", "image2.jpg"]
 *                                              supplierId: 
 *                                                  type: string
 *                                                  example: "6782b8530cbb934e82ba17f4"
 *                                              features:
 *                                                  type: array
 *                                                  items:
 *                                                      type: object
 *                                                      properties:
 *                                                          feature:
 *                                                              type: string
 *                                                              example: "color"
 *                                                          values:
 *                                                              type: string
 *                                                              example: ["red", "blue"]
 *                                              _id:
 *                                                  type: string
 *                                                  example: "6793aced9802fe68afbe4ab7"
 *                                              averageRating:
 *                                                  type: number
 *                                                  example: 1
 *                                              reviewCount:
 *                                                  type: number
 *                                                  example: 1
 *                                              userId:
 *                                                  type: string
 *                                                  example: 6782b8530cbb934e82ba17f4
 *          SaveItem:
 *              type: object
 *              required: ["productId"]
 *              properties:
 *                  productId:
 *                      type: string
 *                      description: Id of the product to be added to the bookmarks
 *          AddToCart:
 *              type: object
 *              required: ["productId", "quantity"]
 *              properties:
 *                  productId:
 *                      type: string
 *                      description: "the ID of the product to add to cart"
 *                  quantity:
 *                      type: number
 *                      description: the amount of the product to be added to the cart
 */

/**
 * @swagger
 * /bookmark/save-item:
 *  post:
 *      summary: add an item to the bookmark
 *      tags: [SaveItem]
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/SaveItem'
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/SaveItem'
 *      responses:
 *          201:
 *              description: item added to bookmarks successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusCode:
 *                                  type: number
 *                                  example: 201
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: string
 *                                          example: "item added successfully"
 *          400:
 *              description: Bad request
 */

/**
 * @swagger
 * /bookmark:
 *  get:
 *      summary: get all saved items
 *      tags: [SaveItem]
 *      responses:
 *          200:
 *              description: saved items retrieved successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/SaveItemResponse'
 *          400:
 *              description: Bad request
 */
/**
 * @swagger
 * /bookmark/remove-item/{productId}:
 *  delete:
 *      summary: remove an item from bookmark
 *      tags: [SaveItem]
 *      parameters:
 *          -   in: path
 *              name: productId
 *              required: true
 *              schema:
 *                  type: string
 *              description: the ID of the product to be removed from saved items
 *      responses:
 *          200:
 *              description: item removed from bookmark successfully
 *              content:
 *                  application/json:
 *                      schema:
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
 *                                          example: "item removed successfully"
 *          400:
 *              description: Bad request
 */

/**
 * @swagger
 * /bookmark/add-to-cart:
 *  post:
 *      summary: add an saved item to cart
 *      tags: [SaveItem]
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/AddToCart'
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/AddToCart'
 *      responses:
 *          200:
 *              description: saved items retrieved successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/SaveItemResponse'
 *          400:
 *              description: Bad request
 */