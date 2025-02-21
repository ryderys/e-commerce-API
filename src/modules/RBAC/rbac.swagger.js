/**
 * @swagger
 * tags:
 *  name: RBAC
 *  description: API for Role-Based Access Control (RBAC) management
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          addRole:
 *              type: object
 *              properties:
 *                  role:
 *                      type: string
 *                      enum:
 *                          -   admin
 *                          -   user
 *                          -   guest
 *                          -   super_admin
 *                          -   special
 *                      example: 'user'
 *                      description: The role name
 *          addPermission:
 *              type: object
 *              properties:
 *                  resource:
 *                      type: string
 *                      example: 'product'
 *                  action:
 *                      type: string
 *                      description: A comma-separated list of actions for the resource
 *                      example: 'create, read, delete, update'
 *                          
 *                  scope:
 *                      type: string
 *                      enum:
 *                          -   own
 *                          -   global
 *          assignRole:
 *              type: object
 *              properties:
 *                  userId:
 *                      type: string
 *                  roleId:
 *                      type: string
 *          updateRolePermission:
 *              type: object
 *              properties:
 *                  permissionIds:
 *                      type: array
 *                      items:
 *                          type: string
 *                      example: ["1"]
 *                      description: A list of permission ObjectIds to be assigned to the role.
 *          assignPermission:
 *              type: object
 *              properties:
 *                  permissions:
 *                      type: array
 *                      items:
 *                          type: string
 *                          description: A list of permission ObjectIds to be assigned to the role.
 *          grantDirectPermission:
 *              type: object
 *              properties:
 *                  userId:
 *                      type: string
 *                  permissionIds:
 *                      type: array
 *                      items:
 *                          type: string
 *                      example: ["1"]
 *                      description: A list of permission ObjectIds to be assigned to the role.
 *                  
 */

/**
 * @swagger
 * /rbac/roles/create:
 *  post:
 *      summary: create a new role
 *      tags: [RBAC]
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/addRole'
 *      responses:
 *          201:
 *              description: role created successfully
 *              
 *      
 */

/**
 * @swagger
 * /rbac/roles:
 *  get:
 *      summary: get all roles
 *      tags: [RBAC]
 *      responses:
 *          200:
 *              description: success
 */

/**
 * @swagger
 * /rbac/roles/{roleId}:
 *  get:
 *      summary: get details of a specific roles
 *      tags: [RBAC]
 *      parameters:
 *          -   in: path
 *              name: roleId
 *              required: true
 *              description: the ID of the role
 *      responses:
 *          200:
 *              description: role details
 *          404:
 *              description: Role not found
 */

/**
 * @swagger
 * /rbac/roles/{roleId}/assign:
 *  put:
 *      summary: assign a role to a user
 *      tags: [RBAC]
 *      parameters:
 *          -   in: path
 *              name: roleId
 *              required: true
 *              description: the ID of the role
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/assignRole'
 *      responses:
 *          201:
 *              description: role created successfully
 *              
 *      
 */

/**
 * @swagger
 * /rbac/roles/permissions/{roleId}:
 *  get:
 *      summary: Get permissions for a role
 *      tags: [RBAC]
 *      parameters:
 *          -   in: path
 *              name: roleId
 *              type: string
 *              required: true
 *              description: the ID of a role
 *      responses:
 *          200:
 *              description: success
 */

/**
 * @swagger
 * /rbac/roles/inheritance/{roleId}:
 *  put:
 *      summary: Add an inherited role to another role
 *      tags: [RBAC]
 *      parameters:
 *          -   in: path
 *              name: roleId
 *              required: true
 *              description: the ID of the role
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          inheritedRoleId:
 *                              type: string
 *      responses:
 *          201:
 *              description: role created successfully
 *              
 *      
 */


/**
 * @swagger
 * /rbac/permissions/create:
 *  post:
 *      summary: create a new permission
 *      tags: [RBAC]
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/addPermission'
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/addPermission'
 *      responses:
 *          201:
 *              description: role created successfully
 *              
 *      
 */


/**
 * @swagger
 * /rbac/permissions/assign/{roleId}:
 *  put:
 *      summary: Assign permissions to a role
 *      tags: [RBAC]
 *      parameters:
 *          -   in: path
 *              name: roleId
 *              required: true
 *              description: the ID of the role
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/assignPermission'
 *      responses:
 *          200:
 *              description: role details
 *          404:
 *              description: Role not found
 */

/**
 * @swagger
 * /rbac/permissions:
 *  get:
 *      summary: get all permissions
 *      tags: [RBAC]
 *      responses:
 *          200:
 *              description: success
 */

/**
 * @swagger
 * /rbac/permissions/{roleId}:
 *  put:
 *      summary: Update permissions for a role
 *      tags: [RBAC]
 *      parameters:
 *          -   in: path
 *              name: roleId
 *              required: true
 *              description: the ID of the role
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/updateRolePermission'
 *      responses:
 *          200:
 *              description: role details
 *          404:
 *              description: Role not found
 */


/**
 * @swagger
 * /rbac/grant-direct-permission:
 *  post:
 *      summary: Grant direct permissions to a user
 *      tags: [RBAC]
 *      parameters:
 *          -   in: path
 *              name: roleId
 *              required: true
 *              description: the ID of the role
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/grantDirectPermission'
 *      responses:
 *          201:
 *              description: role created successfully
 *              
 *      
 */













