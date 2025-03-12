const APP_RESOURCES = require("../../common/constants/resources")
const Authentication = require("../../common/guard/authentication")
const adminAuthMiddleware = require("../../common/guard/authorizeRole")
const { checkPermissions } = require("../../common/middlewares/authz")
const { ReportController } = require("./reports.controller")

const ReportRoutes = require("express").Router()

ReportRoutes.get("/all",adminAuthMiddleware,checkPermissions(APP_RESOURCES.Review, 'read'), ReportController.getReportedReviews) //admin
ReportRoutes.post("/reviews/:reviewId", checkPermissions(APP_RESOURCES.Review, 'create'),Authentication, ReportController.ReportReview) //user

ReportRoutes.patch("/:reportId/resolve", adminAuthMiddleware,checkPermissions(APP_RESOURCES.Review, 'update'), ReportController.resolveReport) //admin middleware

ReportRoutes.get("/:reportId", checkPermissions(APP_RESOURCES.Review, 'read'),ReportController.getReportById)

module.exports = {
    ReportRoutes
}
