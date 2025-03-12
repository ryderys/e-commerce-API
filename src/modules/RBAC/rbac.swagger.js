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
 *                  name:
 *                      type: string
 *                      example: 'user'
 *                      description: The role name
 *                  permissions:
 *                      type: array
 *                      items:
 *                          type: string
 *                          description: permissions ids to assign to the role
 *                  inherits:
 *                      type: string
 *                      description: the role id to be inherited from
 *                      example: "qeflnlfp;wnfp;wf"
 *                  description:
 *                      type: string
 *                      description: role description
 *          addPermission:
 *              type: object
 *              properties:
 *                  resource:
 *                      type: string
 *                      example: "product"
 *                  actions:
 *                      type: array
 *                      items:
 *                          type: string
 *                          example: "create, deleteOwn"
 *                  description:
 *                      type: string
 *                      description: a summary for the permission
 *                          
 *          updatePermission:
 *              type: object
 *              properties:
 *                  resource:
 *                      type: string
 *                      example: "product"
 *                      description: A list of permission ObjectIds to be assigned to the role.
 *                  scope:
 *                      type: string
 *                      enum:
 *                          -   own
 *                          -   global
 *          DirectPermission:
 *              type: object
 *              properties:
 *                  userId:
 *                      type: string
 *                      description: a user Id
 *                  permissionId:
 *                      type: string
 *                      description: A permission Id to be assigned to a user.
 *              
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
 *      summary: get role by ID
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
 * /rbac/roles/{roleId}:
 *  delete:
 *      summary: delete a role by ID
 *      tags: [RBAC]
 *      parameters:
 *          -   in: path
 *              name: roleId
 *              required: true
 *              description: the ID of the role
 *      responses:
 *          200:
 *              description: role deleted successfully
 *          404:
 *              description: Role not found
 */

/**
 * @swagger
 * /rbac/roles/users/{roleId}:
 *  get:
 *      summary: get all users with a role 
 *      tags: [RBAC]
 *      parameters:
 *          -   in: path
 *              name: roleId
 *              required: true
 *              description: the ID of the role
 *      responses:
 *          200:
 *              description: role deleted successfully
 *          404:
 *              description: Role not found
 */


/**
 * @swagger
 * /rbac/roles/{roleId}/assign/{userId}:
 *  post:
 *      summary: assign a role to a user
 *      tags: [RBAC]
 *      parameters:
 *          -   in: path
 *              name: roleId
 *              required: true
 *              description: the ID of the role
 *          -   in: path
 *              name: userId
 *              required: true
 *              description: the ID of the user
 *      responses:
 *          200:
 *              description: role assigned to user successfully 
 */
/**
 * @swagger
 * /rbac/roles/{roleId}/revoke/{userId}:
 *  post:
 *      summary: revoke a role from a user
 *      tags: [RBAC]
 *      parameters:
 *          -   in: path
 *              name: roleId
 *              required: true
 *              description: the ID of the role
 *          -   in: path
 *              name: userId
 *              required: true
 *              description: the ID of the user
 *      responses:
 *          200:
 *              description: role assigned to user successfully 
 */

/**
 * @swagger
 * /rbac/permissions/create:
 *  post:
 *      summary: create a permission
 *      tags: [RBAC]
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/addPermission'
 *      responses:
 *          201:
 *              description: created permission
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
 * /rbac/permissions/{permissionId}:
 *  get:
 *      summary: get permission by ID
 *      tags: [RBAC]
 *      parameters:
 *          -   in: path
 *              name: permissionId
 *              required: true
 *              description: the ID of the permission
 *      responses:
 *          200:
 *              description: permission fetched successfully
 *          404:
 *              description: permission not found
 */



/**
 * @swagger
 * /rbac/permissions/{permissionId}:
 *  patch:
 *      summary: Update a permission 
 *      tags: [RBAC]
 *      parameters:
 *          -   in: path
 *              name: permission
 *              required: true
 *              description: the ID of the permission
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/updatePermission'
 *      responses:
 *          200:
 *              description: role details
 *          404:
 *              description: Role not found
 */

/**
 * @swagger
 * /rbac/permissions/{permissionId}:
 *  delete:
 *      summary: delete a permission
 *      tags: [RBAC]
 *      parameters:
 *          -   in: path
 *              name: permissionId
 *              required: true
 *              description: the ID of the permission
 *      responses:
 *          200:
 *              description: permission deleted successfully
 *          404:
 *              description: permission not found
 */


/**
 * @swagger
 * /rbac/grant-direct-permission:
 *  post:
 *      summary: Grant direct permission to a user
 *      tags: [RBAC]
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/DirectPermission'
 *      responses:
 *          201:
 *              description: role created successfully
 */
/**
 * @swagger
 * /rbac/revoke-direct-permission:
 *  post:
 *      summary: revoke a direct permission from a user
 *      tags: [RBAC]
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/DirectPermission'
 *      responses:
 *          201:
 *              description: role created successfully
 */













