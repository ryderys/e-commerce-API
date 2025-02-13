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

            const review = await ReviewModel.findById(reviewId).select('hidden').lean()
            if(!review) throw new httpError.NotFound(ReportMsg.ReviewNFound)
            if(review.hidden) throw new httpError.Gone(ReportMsg.AlreadyResolved)
            

            
            const existingReport = await ReportModel.findOne({reviewId, reporter})
            if(existingReport){
                throw new httpError.Conflict(ReportMsg.ReportExists)
            }

            const report = await ReportModel.create({
                reviewId,
                reporter,
                reason: reason.trim(),
                description: description?.trim()
            })
            return sendResponse(res, StatusCodes.CREATED, ReportMsg.ReportCreated, {
                report: {
                    id: report._id,
                    status: report.status,
                    createdAt: report.createdAt,
                }
            
            })
        } catch (error) {
            next(error)
        }
    }

    async getReportById(req, res, next){
        try {
            const {reportId} = req.params;
        
            const report = await ReportModel.findById(reportId)
                .populate('reporter', 'name email')
                .populate({
                    path: 'reviewId',
                    select: 'userId productId rating comment createdAt hidden',
                    populate: {
                        path: 'userId',
                        select: 'name'
                    }
                })
                if(!report) throw new httpError.NotFound(ReportMsg.ReportNFound)

            const response = {
                reportId: report._id,
                reason: report.reason,
                status: report.status,
                createdAt: report.createdAt,
                review: {
                    id: report.reviewId._id,
                    rating: report.reviewId.rating,
                    comment: report.reviewId.comment,
                    author: report.reviewId.userId.name,
                    createdAt: report.reviewId.createdAt,
                    hidden: report.reviewId.hidden,
                    
                }
            }
            return sendResponse(res, StatusCodes.OK, null, {report: response})
        } catch (error) {
            next(error)
        }
    }
    async getReportedReviews(req, res, next){
        try {

            const reportedReviews = await ReportModel.find({status: 'pending'})
            .populate([
                {path: 'reporter', select: 'name'},
                {
                    path: 'reviewId',
                    select: 'rating comment createdAt',
                    populate: {
                        path: 'userId',
                        select: 'name'
                    }
                }
            ])
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