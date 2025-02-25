/**
 * @swagger
 * tags:
 *  name: Transaction
 *  description: Transaction module and routes
 */

/**
 * @swagger
 * /transaction/history:
 *  get:
 *      summary: get all transactions history
 *      tags: [Transaction]
 *      responses:
 *          200:
 *              description: list of transactions
 */

/**
 * @swagger
 * /transaction/history/{transactionId}:
 *  get:
 *      summary: get all transactions history
 *      tags: [Transaction]
 *      parameters:
 *          -   in: path
 *              name: transactionId
 *              required: true
 *              description: ID of the transaction
 *      responses:
 *          200:
 *              description: list of transactions
 */