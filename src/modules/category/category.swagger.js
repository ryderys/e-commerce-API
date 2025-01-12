/**
 * @swagger
 * tags:
 *  name: Category
 *  description: Category module and routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          createCategory:
 *              type: object
 *              required: ["title", "icon"]
 *              properties:
 *                  title:
 *                      type: string
 *                      description: the title of the category
 *                      example: "Jacket"
 *                  slug:
 *                      type: string
 *                      description: the selected slug for the category
 *                      example: "jacket"
 *                  icon:
 *                      type: string
 *                      description: the selected icon for the category
 *                      example: "https://example.com/icons/electronics.png"
 *                  parent:
 *                      type: string
 *                      description: the ID of the parent category
 *          categoryResponse:
 *              type: object
 *              properties:
 *                  statusCode:
 *                      type: number
 *                      example: 200
 *                  message:
 *                      type: string
 *                      example: "Product Created successfully"
 *                  data: 
 *                      type: object
 *                      properties:
 *                          newCategory:
 *                              type: object
 *                              properties:
 *                                  title:
 *                                      type: string
 *                                      example: "Electronics"
 *                                  slug:
 *                                      type: string
 *                                      example: "electronics"
 *                                  icon:
 *                                      type: string
 *                                      example: "https://example.com/icons/electronics.png"
 *                                  parents:
 *                                      type: array
 *                                      items:
 *                                          type: string
 *                                      example: ["64abcd1234ef5678ghijkl12"]
 *                                  parent:
 *                                      type: string
 *                                      nullable: true
 *                                      example: "64abcd1234ef5678ghijkl90"
 *                                  _id:
 *                                      type: string
 *                                      example: "64abcd1234ef5678ghijkl90"
 *          AllCategoryResponse:
 *              type: object
 *              properties:
 *                  statusCode:
 *                      type: number
 *                      example: 200
 *                  data:
 *                      type: object
 *                      properties:
 *                          categories:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      _id:
 *                                          type: string
 *                                          example: "64abcd1234ef5678ghijkl90"
 *                                      title:
 *                                          type: string
 *                                          example: Electronics
 *                                      children:
 *                                          type: array
 *                                          items:
 *                                              type: object
 *                                              properties:
 *                                                  _id:
 *                                                      type: string
 *                                                      example: "64abcd1234ef5678ghijkl90"
 *                                                  title:
 *                                                      type: string
 *                                                      example: T-shirt
 *                                                  children:
 *                                                      type: array
 *        
 *                              
 *          ErrorResponse:
 *              type: object
 *              properties:
 *                  statusCode:
 *                      type: number
 *                      example: 400
 *                  message:
 *                      type: string
 *                      example: "Invalid Request Parameters"
 * 
 * 
 */

/**
 * @swagger
 * /category/add:
 *  post:
 *      summary: Create a new project
 *      tags: [Category]
 *      requestBody:
 *          required: true 
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/createCategory'
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/createCategory'
 *      responses:
 *          201:
 *              description: Category Created Successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/categoryResponse'
 *          400:
 *              description: Invalid request parameters
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 */


/**
 * @swagger
 * /category/all:
 *  get:
 *      summary: get all categories
 *      tags: [Category]
 *      responses:
 *          200:
 *              description: A list of root categories
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/AllCategoryResponse'
 *          400:
 *              description: Bad Request
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /category/remove/{id}:
 *  delete:
 *      summary: Delete a category and its descendants
 *      tags: [Category]
 *      parameters:
 *          -   in: path
 *              required: true
 *              schema:
 *                  type: string
 *                  example: "64abcd1234ef5678ghijkl90"
 *              description: The ID of the category to delete
 *      responses:
 *          200:
 *              description: category deleted successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusCode:
 *                                  type: number
 *                                  example: 200
 *                              message:
 *                                  type: string
 *                                  example: "Category deleted successfully"
 *          400:
 *              description: Invalid Category ID
 *      
 */