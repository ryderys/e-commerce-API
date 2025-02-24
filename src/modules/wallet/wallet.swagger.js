/**
 * @swagger
 * tags:
 *  name: Wallet
 *  description: wallet module and routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          DepositFunds:
 *              type: object
 *              properties:
 *                  amount:
 *                      type: number
 *                      example: 100
 *                  currency:
 *                      type: string
 *                      enum: ['USD', 'EUR', 'GBP']
 *                      example: USD 
 *              
 */

/**
 * @swagger
 * /wallet/:
 *  get:
 *      summary: get user balance
 *      tags: [Wallet]
 *      responses:
 *          200:
 *              description: user wallet
 *          404:
 *              description: wallet not found
 */
/**
 * @swagger
 * /wallet/deposit:
 *  post:
 *      summary: deposit funds
 *      tags: [Wallet]
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/DepositFunds'
 *      responses:
 *          200:
 *              description: user wallet
 *          404:
 *              description: wallet not found
 */
/**
 * @swagger
 * /wallet/withdrawal:
 *  post:
 *      summary: withdraw funds
 *      tags: [Wallet]
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/DepositFunds'
 *      responses:
 *          200:
 *              description: user wallet
 *          404:
 *              description: wallet not found
 */

