const { ReportController } = require("./reports.controller")

const ReportRoutes = require("express").Router()

ReportRoutes.get("/", ReportController.getReportedReviews) //admin
ReportRoutes.post("/reviews/:reviewId",  ReportController.ReportReview) //user

ReportRoutes.patch("/:reportId/resolve", ReportController.resolveReport) //admin middleware

ReportRoutes.get("/:reportId", ReportController.getReport)
