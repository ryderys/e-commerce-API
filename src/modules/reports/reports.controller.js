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

    async getReport(req, res, next){
        try {
            const {reportId} = req.params;
        
            const report = await ReportModel.findById(reportId)
                .populate('reporter', 'name email')
                .populate('reviewId')
                
            return sendResponse(res, StatusCodes.OK, null, {report})
        } catch (error) {
            next(error)
        }
    }
    async getReportedReviews(req, res, next){
        try {

            const reportedReviews = await ReportModel.find({status: 'pending'})
            .populate('reporter', 'name email')
            .populate('reviewId')
            .sort('-createdAt')
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