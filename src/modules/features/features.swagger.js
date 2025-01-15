/**
 * @swagger
 * tags:
 *  name: Feature
 *  description: Features module and routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          addFeatures:
 *              type: object
 *              required: ["title", "key", "type", "category"]
 *              properties:
 *                  title:
 *                      type: string
 *                      description: the title of the feature
 *                      example: "rang"
 *                  key:
 *                      type: string
 *                      description: the key of the feature
 *                      example: "color" 
 *                  category:
 *                      type: string
 *                      description: Category ID to which the feature belongs
 *                      example: "607f1f77bcf86cd799439011"
 *                  guid:
 *                      type: string
 *                      description: Optional GUID for the feature
 *                      example: "some-guid"
 *                  type:
 *                      type: string
 *                      description: the type of the features 
 *                      enum:
 *                          -   number
 *                          -   string
 *                          -   boolean
 *                          -   array
 *                  list:
 *                      type: array
 *                      items:
 *                          type: string
 *                      description: Optional list of values
 *                      example: ["Red", "Blue", "Green"]
 *          updateFeatures:
 *              type: object
 *              properties:
 *                  title:
 *                      type: string
 *                      description: the title of the feature
 *                      example: "rang"
 *                  key:
 *                      type: string
 *                      description: the key of the feature
 *                      example: "color" 
 *                  category:
 *                      type: string
 *                      description: Category ID to which the feature belongs
 *                      example: "607f1f77bcf86cd799439011"
 *                  guid:
 *                      type: string
 *                      description: Optional GUID for the feature
 *                      example: "some-guid"
 *                  type:
 *                      type: string
 *                      description: the type of the features 
 *                      enum:
 *                          -   number
 *                          -   string
 *                          -   boolean
 *                          -   array
 *                  list:
 *                      type: array
 *                      items:
 *                          type: string
 *                      description: Optional list of values
 *                      example: ["Red", "Blue", "Green"]
 *          getAllFeatures:
 *              type: object
 *              properties: 
 *                  statusCode:
 *                      type: number
 *                      example: 200
 *                  data:
 *                      type: object
 *                      properties:
 *                          features:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      category:
 *                                          type: object
 *                                          properties:
 *                                              title:
 *                                                  type: string
 *                                                  example: t-shirt
 *                                              _id:
 *                                                  type: string
 *                                                  example: "64abcd1234ef5678ghijkl90"
 *                                      features:
 *                                          type: array
 *                                          items:
 *                                              type: object
 *                                              properties:
 *                                                  _id:
 *                                                      type: string 
 *                                                      example: "64abcd1234ef5678ghijkl90" 
 *                                                  title:
 *                                                      type: string 
 *                                                      example: Color 
 *                                                  key:
 *                                                      type: string 
 *                                                      example: color 
 *                                                  type:
 *                                                      type: string 
 *                                                      example: array 
 *                                                  list:
 *                                                      type: string
 *                                                      items:
 *                                                          type: string 
 *                                                      example: ["black", "white"] 
 *                                                  guid:
 *                                                      type: string
 *                                                      example: "choose one of the options"
 *          feature:
 *              type: object
 *              properties:
 *                  title:
 *                      type: string
 *                  key:
 *                      type: string
 *                  type:
 *                      type: string
 *                  list:
 *                      type: array
 *                      items:
 *                          type: string
 *                  guid:
 *                      type: string
 *                  category:
 *                      type: string
 *                  _id:
 *                      type: string
 *              example:
 *                  _id: "60d0fe4f5311236168a109ca"
 *                  title: "Color"
 *                  key: "color"
 *                  type: "array"
 *                  list: ["red", "blue"]
 *                  guid: "choose the required color"
 *                  category: "607f1f77bcf86cd799439011" 
 *          errorResponse:
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
 *                              example: "Invalid Request parameters"
 */


/**
 * @swagger
 * /feature/add:
 *  post:
 *      summary: Add a new feature
 *      tags: [Feature]
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/addFeatures'
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/addFeatures'
 *      responses:
 *          201:
 *              description: Feature Created Successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/feature'
 *          400:
 *              description: Invalid request parameters
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/errorResponse'
 */

/**
 * @swagger
 * /feature/update/{id}:
 *  post:
 *      summary: update a feature by ID
 *      tags: [Feature]
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/updateFeatures'
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/updateFeatures'
 *      responses:
 *          200:
 *              description: Feature updated Successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/feature'
 *          400:
 *              description: Invalid request parameters
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/errorResponse'
 */

/**
 * @swagger
 * /feature/all:
 *  get:
 *      summary: Fetch all features.
 *      tags: [Feature]
 *      responses:
 *          200:
 *              description: Successfully fetched all features.
 *              content:
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/getAllFeatures'
 *          500:
 *              description: server error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref:  '#/components/schemas/errorResponse'
 *          
 */

/**
 * @swagger
 * /feature/by-category/{categoryId}:
 *  get:
 *      summary: get all features of a category
 *      tags: [Feature]
 *      parameters:
 *          -   in: path
 *              name: categoryId
 *              required: true
 *              schema: 
 *                  type: string
 *                  example: "64abcd1234ef5678ghijkl90"
 *              description: the ID of the category for fetching its features
 *      responses:
 *          200:
 *              description: successfully fetched features by categoryID
 *          400:
 *              description: Invalid request parameters
 */

/**
 * @swagger
 * /feature/remove/{id}:
 *  delete:
 *      summary: delete a feature by ID
 *      tags: [Feature]
 *      parameters:
 *          -   in: path
 *              name: id
 *              required: true
 *              schema:
 *                  type: string
 *                  example: "64abcd1234ef5678ghijkl90"
 *              description: the ID of the feature to delete
 *      responses:
 *          200:
 *              description: feature deleted successfully
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
 *                                  example: "feature deleted successfully"
 *      
 */