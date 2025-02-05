/**
 * @swagger
 * tags:
 *  name: Report
 *  description: Report module and routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          CreateReport:
 *              type: object
 *              required: ["reason", "description"]
 *              properties:
 *                  reason:
 *                      type: string
 *                      enum:
 *                          -   spam
 *                          -   inappropriate
 *                          -   false_info
 *                          -   other
 *                      description: reason for reporting
 *                  description:
 *                      type: string
 *                      description: Additional details about the report
 *          Resolve:
 *              type: object
 *              properties:
 *                  status: 
 *                      type: string
 *                      enum:
 *                          -   resolved
 *                          -   rejected
 *                      description: The status of the report (resolved or rejected).
 *                  action:
 *                      type: string
 *                      enum: 
 *                          -   remove
 *                          -   keep
 *                      description: Action taken after resolving the report (e.g., remove the review or keep it).
 *          ReportResponse:
 *              type: object
 *              properties:
 *                  statusCode:
 *                      type: number
 *                      example: 200
 *                  data: 
 *                      type: object
 *                      properties:
 *                          _id:
 *                              type: string
 *                              example: "67a379624b358479bd89c7f7"
 *                          reporter:
 *                              type: object
 *                              properties:
 *                                  reportedId:
 *                                      type: string 
 *                                      example: "6782b8530cbb934e82ba17f4"
 *                          review:
 *                              type: object
 *                              properties:
 *                                  _id: 
 *                                      type: string
 *                                      example: "67a0de10b2fe419ddc277feb"
 *                                  userId:
 *                                      type: string
 *                                      example: "6782b8530cbb934e82ba17f4"
 *                                  productId:
 *                                      type: string
 *                                      example: "678f7afccf41dd7a530013d8"
 *                                  rating:
 *                                      type: number
 *                                      example: 3
 *                                  comment:
 *                                      type: string
 *                                      example: "a users comment"
 *                                  createdAt:
 *                                      type: string
 *                                      format: date-time
 *                          reason:
 *                              type: string
 *                              example: "inappropriate"
 *                          description:
 *                              type: string
 *                              example: "the user commented bad words"
 *                          edited: 
 *                              type: boolean
 *                              example: true
 *                          status:
 *                              type: string
 *                              example: pending
 *                          createdAt:
 *                              type: string
 *                              format: date-time
 *                          updatedAt:
 *                              type: string
 *                              format: date-time
 *          GetReportResponse:
 *              type: object
 *              properties:
 *                  statusCode:
 *                      type: number
 *                      example: 200
 *                  data: 
 *                      type: object
 *                      properties:
 *                          reportId:
 *                              type: string
 *                              example: "67a379624b358479bd89c7f7"
 *                          reporterId:
 *                              type: string 
 *                              example: "6782b8530cbb934e82ba17f4"
 *                          reviewId:
 *                              type: string
 *                              example: "67a0de10b2fe419ddc277feb"
 *                          userId:
 *                              type: string
 *                              example: "6782b8530cbb934e82ba17f4"
 *                          productId:
 *                              type: string
 *                              example: "678f7afccf41dd7a530013d8"
 *                          rating:
 *                              type: number
 *                              example: 3
 *                          comment:
 *                              type: string
 *                              example: "a users comment"
 *                          reviewCreatedAt:
 *                              type: string
 *                              format: date-time
 *                          reason:
 *                              type: string
 *                              example: "inappropriate"
 *                          description:
 *                              type: string
 *                              example: "the user commented bad words"
 *                          edited: 
 *                              type: boolean
 *                              example: true
 *                          status:
 *                              type: string
 *                              example: pending
 *                          createdAt:
 *                              type: string
 *                              format: date-time
 *                          updatedAt:
 *                              type: string
 *                              format: date-time
 *          ResolveResponse:
 *              type: object
 *              properties:
 *                  statusCode:
 *                      type: number
 *                      example: 200
 *                  data: 
 *                      type: object
 *                      properties:
 *                          reportId:
 *                              type: string
 *                              example: "67a379624b358479bd89c7f7"
 *                          reporterId:
 *                              type: string 
 *                              example: "6782b8530cbb934e82ba17f4"
 *                          reviewId:
 *                              type: string
 *                              example: "67a0de10b2fe419ddc277feb"
 *                          reason:
 *                              type: string
 *                              example: "inappropriate"
 *                          description:
 *                              type: string
 *                              example: "the user commented bad words"
 *                          edited: 
 *                              type: boolean
 *                              example: true
 *                          status:
 *                              type: string
 *                              example: pending
 *                          createdAt:
 *                              type: string
 *                              format: date-time
 *                          updatedAt:
 *                              type: string
 *                              format: date-time
 *                          resolvedBy:
 *                              type: string
 *                              example: "6782b8530cbb934e82ba17f4"
 */

/**
 * @swagger
 * /report/reviews/{reviewId}:
 *  post:
 *      summary: Report a review
 *      description: Allows a user to report a review
 *      tags: [Report]
 *      parameters:
 *          -   in: path
 *              name: reviewId
 *              required: true
 *              type: string
 *              description: the id of the review to report
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateReport' 
 *      responses:
 *          201:
 *              description: Report successfully created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CreateReportResponse'
 *          400: 
 *              description: Bad request
 *          404: 
 *              description: review not found
 */

/**
 * @swagger
 * /report/all:
 *  get:
 *      summary: Get all reported reviews
 *      description: Retrieve a list of all reviews that have been reported and are still pending resolution
 *      tags: [Report]
 *      responses:
 *          200:
 *              description: List of reported reviews
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ReportResponse'
 *          404:
 *              description: No reports found
 */

/**
 * @swagger
 * /report/{reportId}:
 *  get:
 *      summary: Get specific report
 *      description: Fetch details of a specific report by reportId
 *      tags: [Report]
 *      parameters:
 *          -   in: path
 *              name: reportId
 *              required: true
 *              type: string
 *      responses:
 *          200:
 *              description: Report found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetReportResponse'
 *          404:
 *              description: Report not found
 */

/**
 * @swagger
 * /report/{reportId}/resolve:
 *  patch:
 *      summary: Resolve or reject a report"
 *      description: Allows admins to resolve or reject a reported review and optionally take action such as hiding the review
 *      tags: [Report]
 *      parameters:
 *          -   in: path
 *              name: reportId
 *              type: string
 *              required: true
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/Resolve'
 *      responses:
 *          200:
 *              description: Report resolved or rejected successfully
 *              content:
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/ResolveResponse'
 *          400:
 *              description: Invalid status or action
 *          404:
 *              description: Report not found
 */