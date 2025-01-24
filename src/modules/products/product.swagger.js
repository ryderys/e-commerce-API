/**
 * @swagger
 * tags:
 *  name: Product
 *  description: Product module and routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          Feature:
 *              type: object
 *              properties:
 *                  feature:
 *                      type: string
 *                      example: "color"
 *                      description: The name of the feature (e.g., "Color", "Size")
 *                  values:
 *                      type: array
 *                      items:
 *                          type: string
 *                      example: ["red", "blue"]
 *                      description: The values for this feature (e.g., 'red', 'green')
 *          addProduct:
 *              type: object
 *              required:  ["title", "summary", "description", "category", "price", "count"]
 *              properties:
 *                  title:
 *                      type: string
 *                      description: the title of product
 *                      example: "t-shirt"
 *                  summary:
 *                      type: string    
 *                      description: summary of product
 *                      example: "A short summary of the product"
 *                  description:
 *                      type: string    
 *                      description: detailed description of the product
 *                      example: "This is an awesome product with great features."
 *                  tags:
 *                      oneOf:
 *                          - type: string
 *                          - type: array   
 *                      items:
 *                          type: string
 *                      description: Tags for the product. You can provide a single string of tags separated by commas, hashes, or whitespace, or an array of strings. The API will process and convert string inputs into an array.
 *                      example: electronics, gadgets
 *                  category:
 *                      type: string    
 *                      description: category ID of the product
 *                      example: "64c9a4b23e2345d67"
 *                  price:
 *                      type: string    
 *                      description: price of the product
 *                      example: "99.99"
 *                  count:
 *                      type: number    
 *                      description: the count of product
 *                      example: 1
 *                  images:
 *                      type: array    
 *                      items:
 *                          type: string
 *                          format: binary
 *                      description: images of the product
 *                  features:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Feature'
 *                      description: An array of features for the product, with each feature containing a name and a set of values
 *          updateProduct:
 *              type: object
 *              properties:
 *                  title:
 *                      type: string
 *                      description: the title of product
 *                      example: "t-shirt"
 *                  summary:
 *                      type: string    
 *                      description: summary of product
 *                      example: "A short summary of the product"
 *                  description:
 *                      type: string    
 *                      description: detailed description of the product
 *                      example: "This is an awesome product with great features."
 *                  tags:
 *                      oneOf:
 *                          - type: string
 *                          - type: array   
 *                      items:
 *                          type: string
 *                      description: Tags for the product. You can provide a single string of tags separated by commas, hashes, or whitespace, or an array of strings. The API will process and convert string inputs into an array.
 *                      example: electronics, gadgets
 *                  category:
 *                      type: string    
 *                      description: category ID of the product
 *                      example: "64c9a4b23e2345d67"
 *                  price:
 *                      type: string    
 *                      description: price of the product
 *                      example: "99.99"
 *                  count:
 *                      type: number    
 *                      description: the count of product
 *                      example: 1
 *                  images:
 *                      type: array    
 *                      items:
 *                          type: string
 *                          format: binary
 *                      description: images of the product
 *                  features:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Feature'
 *                      description: An array of features for the product, with each feature containing a name and a set of values
 *          PaginationMetadata:
 *              type: object
 *              properties:
 *                  page:
 *                      type: number
 *                      description: current page number
 *                      example: 1
 *                  limit:
 *                      type: number
 *                      description: number of items per page
 *                      example: 10
 *                  totalItems:
 *                      type: number
 *                      description: total number of products available
 *                      example: 100
 *                  totalPages:
 *                      type: number
 *                      description: total number of pages
 *                      example: 10
 *          productResponse:
 *              type: object
 *              properties:
 *                  statusCode:
 *                      type: number
 *                      example: 200
 *                  data:
 *                      type: object
 *                      properties:
 *                          products:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: string
 *                                      example: "64c9a4b23e2345d67"
 *                                  title:
 *                                      type: string
 *                                      example: "Awesome Product"
 *                                  count:
 *                                      type: number
 *                                      example: 1
 *                                  summary:
 *                                      type: string
 *                                      example: "Product summary"
 *                                  description:
 *                                      type: string
 *                                      example: "Detailed product description"
 *                                  category:
 *                                      type: object
 *                                      example: "64c9a4b23e2345d67"
 *                                  price:
 *                                      type: string
 *                                      example: "99.99"
 *                                  images:
 *                                      type: array
 *                                      items:
 *                                          type: string
 *                                          example: ["image1.jpg", "image2.jpg"]
 *                                  tags:
 *                                      type: array
 *                                      items:
 *                                          type: string
 *                                          example: ["tag1", "tag2"]
 *                                  message:
 *                                      type: string
 *                                      example: product added successfully
 *          getAllProductsResponse:
 *              type: object
 *              properties:
 *                  id:
 *                      type: string
 *                      example: "64c9a4b23e2345d67"
 *                  title:
 *                      type: string
 *                      example: "Awesome Product"
 *                  summary:
 *                      type: string
 *                      example: "Product summary"
 *                  description:
 *                      type: string
 *                      example: "Detailed product description"
 *                  price:
 *                      type: number
 *                      example: "99.99"
 *                  count:
 *                      type: number
 *                      example: 1
 *                  images:
 *                      type: array
 *                      items:
 *                          type: string
 *                          example: ["image1.jpg", "image2.jpg"]
 *                  tags:
 *                      type: array
 *                      items:
 *                          type: string
 *                          example: ["tag1", "tag2"]
 *                  features:
 *                      type: array
 *                      items:
 *                          type: object
 *                          properties:
 *                              feature:
 *                                  type: string
 *                                  example: "color"
 *                              values:
 *                                  type: array
 *                                  items:
 *                                      type: string
 *                              example: ["red", "blue"]
 *                  reviewCount:
 *                      type: number
 *                      example: 1
 *                  averageRating:
 *                      type: number
 *                      example: 1
 *                  category:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: string
 *                              example: "64c9a4b23e2345d67"
 *                          title:
 *                              type: string
 *                              example: "t-shirt"
 *                          parent:
 *                              type: string
 *                              example: "6783f661946844b72680020e"
 *                  createdAt:
 *                      type: string
 *                      format: date-time
 *                  updatedAt:
 *                      type: string
 *                      format: date-time
 *                                      
 *                                      
 *          errorResponse:
 *              type: object
 *              properties:
 *                  statusCode:
 *                      type: number
 *                      example: 400
 *                  message:
 *                      type: string
 *                      example: "Invalid Request parameters"
 *
 *        
 */

/**
 * @swagger
 * /product/add:
 *  post:
 *      summary: Add a new product
 *      tags: [Product]
 *      requestBody:
 *          required: true
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      $ref: '#/components/schemas/addProduct'
 *      responses:
 *          201:
 *              description: product created successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/productResponse'
 *          400:
 *              description: Invalid Request Parameters
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref:  '#/components/schemas/errorResponse'
 */

/**
 * @swagger
 * /product/update/{productId}:
 *  patch:
 *      summary: update a product by id
 *      tags: [Product]
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
 *              multipart/form-data:
 *                  schema:
 *                      $ref: '#/components/schemas/updateProduct'
 *      responses:
 *          200:
 *              description: product updated successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/productResponse'
 *          400:
 *              description: Invalid Request Parameters
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref:  '#/components/schemas/errorResponse'
 */

/**
 * @swagger
 * /product/all:
 *  get:
 *      summary: get all products
 *      tags: [Product]
 *      parameters:
 *          -   in: query
 *              name: search
 *              schema:
 *                  type: string
 *              description: Search term for product title, summary, or description
 *          -   in: query
 *              name: page
 *              schema:
 *                  type: number
 *              description: Page number for pagination
 *              example: 1
 *          -   in: query
 *              name: limit
 *              schema:
 *                  type: number
 *              description: Number of items per page
 *              example: 10
 *      responses:
 *          200:
 *              description: A list of products
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
 *                                      products:
 *                                          type: array
 *                                          items:
 *                                              $ref: '#/components/schemas/getAllProductsResponse'
 *                                      pagination:
 *                                          $ref: '#/components/schemas/PaginationMetadata'
 *          400:
 *              description: Invalid Request Parameters
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref:  '#/components/schemas/errorResponse'
 */

/**
 * @swagger
 * /product/{id}:
 *  get:
 *      summary: get a single product by ID
 *      tags: [Product]
 *      parameters:
 *          -   in: path
 *              name: id
 *              required: true
 *              schema:
 *                  type: string
 *              description: ID of the product
 *      responses:
 *          200:
 *              description: A singe product
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/productResponse'
 *          404:
 *              description: Product Not Found
 *              content:    
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/errorResponse'
 *              
 */

/**
 * @swagger
 * /product/remove/{id}:
 *  delete:
 *      summary: Remove a product by ID
 *      tags: [Product]
 *      parameters:
 *          -   in: path
 *              name: id
 *              required: true
 *              schema:
 *                  type: string
 *              description: ID of the product
 *      responses:
 *          200:
 *              description: Product Removed successfully
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
 *                                  example: "Product removed successfully"
 *          400:
 *              description: Invalid Request Parameters
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/errorResponse'
 */

