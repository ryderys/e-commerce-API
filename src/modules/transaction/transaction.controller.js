const { TransactionModel } = require("./transaction.model");
const httpError = require("http-errors");
const { TransactionMsg } = require("./transaction.msg");
const { StatusCodes } = require("http-status-codes");
const { sendResponse } = require("../../common/utils/helperFunctions");

class TransactionController{
    async getTransactionHistoryByUserId(req, res, next){
        try {
            const userId = req.user._id;

            const transaction = await TransactionModel.find({user: userId}).sort('-createdAt')

            if(!transaction) throw new httpError.NotFound(TransactionMsg.TransactionNFound)
            
            return sendResponse(res, StatusCodes.OK, null, {transaction})
        } catch (error) {
            next(error)
        }
    }
    async getTransactionHistoryById(req, res, next){
        try {
            const {transactionId} = req.params;
            const userId = req.user._id;
            const transaction = await TransactionModel.findOne({
                _id: transactionId,
                user: userId
            }).populate('order')

            if(!transaction) throw new httpError.NotFound(TransactionMsg.TransactionNFound)
            
            return sendResponse(res, StatusCodes.OK, null, {transaction})
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {
    TransactionController: new TransactionController()
}