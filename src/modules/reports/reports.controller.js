const { ReportModel } = require("./reports.model");
const { StatusCodes } = require("http-status-codes");
const httpError = require("http-errors");
const { sendResponse } = require("../../common/utils/helperFunctions");
const { ReportMsg } = require("./reports.Msg");
const { ReviewModel } = require("../reviews/reviews.model");

class ReportController{
    async ReportReview(req, res, next){
        try {
            const {reviewId} = req.params
            const { reason, description} = req.body;
            const reporter = req.user._id;

            const reviewExists = await ReviewModel.exists({_id: reviewId})
            if(!reviewExists){
                throw new httpError.NotFound(ReportMsg.ReviewNFound)
            }

            const existingReport = await ReportModel.findOne({reviewId, reporter})
            if(existingReport){
                throw new httpError.Conflict(ReportMsg.ReportExists)
            }

            const report = await ReportModel.create({
                reviewId,
                reporter,
                reason,
                description
            })
            return sendResponse(res, StatusCodes.CREATED, ReportMsg.ReportCreated, {report})
        } catch (error) {
            next(error)
        }
    }

    async getReportById(req, res, next){
        try {
            const {reportId} = req.params;
        
            const report = await ReportModel.findById(reportId)
                .populate('reporter', 'name email')
                .populate('reviewId')
            const response = {
                reportId: report._id,
                reporterId: report.reporter._id,
                reporterName: report.reporter?.name,
                reporterEmail: report.reporter?.email,
                reviewId: report.reviewId._id,
                userId: report.reviewId.userId,
                productId: report.reviewId.productId,
                reviewRating: report.reviewId.rating,
                reviewComment: report.reviewId.comment,
                isReviewEdited: report.reviewId.edited,
                reviewCreatedAt: report.reviewId.createdAt,
                reason: report.reason,
                description: report.description,
                status: report.status,
                createdAt: report.createdAt,
                updatedAt: report.updatedAt
            }
            return sendResponse(res, StatusCodes.OK, null, {report: response})
        } catch (error) {
            next(error)
        }
    }
    async getReportedReviews(req, res, next){
        try {

            const reportedReviews = await ReportModel.find({status: 'pending'})
            .populate('reporter', 'name email')
            .populate('reviewId', 'userId productId rating comment createdAt')
            .sort('-createdAt')
            // const response = {
            //     reportId: reportedReviews._id,
            //     reporterId: reportedReviews.reporter,
            //     reviewRating: reportedReviews.reviewId.rating,
            //     reviewComment: reportedReviews.reviewId.comment,
            //     reviewCreatedAt: reportedReviews.reviewId.reviewCreatedAt,
            //     reason: reportedReviews.reason,
            //     description: reportedReviews.description,
            //     status: reportedReviews.status,
            //     createdAt: reportedReviews.createdAt,
            //     updatedAt: reportedReviews.updatedAt
            // }
            // console.log(response)
            return sendResponse(res, StatusCodes.OK, null, {reportedReviews})
        } catch (error) {
            next(error)
        }
    }

    async resolveReport(req, res, next){
        try {
            const {reportId} = req.params
            const {status, action} = req.body; // Status can be 'resolved' or 'rejected'
            const adminId = req.user._id

                // Validate status
            if(!['resolved', 'rejected'].includes(status)){
                throw new httpError.BadRequest(ReportMsg.InvalidStatus)
            }

            const report = await ReportModel.findById(reportId)
            if(!report){
                throw new httpError.NotFound(ReportMsg.ReportNFound)
            }

            if(report.status === 'resolved'){
                throw new httpError.BadRequest(ReportMsg.AlreadyResolved)
            }
            report.status = status
            report.edited = true
            report.resolvedBy = adminId

            if(status === 'resolved' && action === 'remove'){
                await ReviewModel.findByIdAndUpdate(report.reviewId, {hidden: true, hiddenReason: 'Reported content'})
            }
            await report.save()
            return sendResponse(res, StatusCodes.OK, `Report ${status}`, {report})
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {
    ReportController: new ReportController()
}