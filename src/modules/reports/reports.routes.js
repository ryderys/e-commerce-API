const Authentication = require("../../common/guard/authentication")
const { ReportController } = require("./reports.controller")

const ReportRoutes = require("express").Router()

ReportRoutes.get("/all",Authentication, ReportController.getReportedReviews) //admin
ReportRoutes.post("/reviews/:reviewId", Authentication, ReportController.ReportReview) //user

ReportRoutes.patch("/:reportId/resolve", Authentication, ReportController.resolveReport) //admin middleware

ReportRoutes.get("/:reportId", ReportController.getReportById)

module.exports = {
    ReportRoutes
}
