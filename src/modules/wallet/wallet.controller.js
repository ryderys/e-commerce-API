const { StatusCodes } = require("http-status-codes");
const { sendResponse } = require("../../common/utils/helperFunctions");
const { WalletModel } = require("./wallet.model")
const httpError = require("http-errors");
const { WalletMsg } = require("./wallet.msg");
const { TransactionModel } = require("../transaction/transaction.model");

class WalletController{
    async getBalance(req, res, next){
        try {
            const userId = req.user._id
            const wallet = await WalletModel.findOne({user: userId})
                .select('balance currency isActive');
            if(!wallet) throw new httpError.NotFound(WalletMsg.WalletNFound)
            return sendResponse(res, StatusCodes.OK, null, {wallet})
        } catch (error) {
            next(error)
        }
    }
    async addFunds(req, res, next){
        try {
            const {amount, currency} = req.body
            const userId = req.user._id;
            // const wallet = await WalletModel.findOne({user: userId})
            
            const transaction = new TransactionModel({
                amount,
                type: 'deposit',
                status: 'completed',
                currency,
                description: 'funds added to wallet',
                order: null,
                user: userId
            })

            await transaction.save()

            const updatedWallet = await WalletModel.findOneAndUpdate(
                {user: userId},
                {
                    $inc: {balance: amount},
                },
                {new: true, upsert: true}
            )

            const responseWallet = {
                _id: updatedWallet._id,
                balance: updatedWallet.balance,
                currency: updatedWallet.currency,
                // transaction: updatedWallet.transaction.map((txn) =>({
                //     amount: txn.amount,
                //     type: txn.type,
                //     status: txn.status,
                //     currency: txn.currency,
                // }))
            }

            return sendResponse(res, StatusCodes.OK, WalletMsg.AddedFund, {wallet: responseWallet})
            
        } catch (error) {
            next(error)
        }
    }
    async withdrawFunds(req, res, next){
        try {
            const {amount, currency} = req.body
            const userId = req.user._id;
            const updatedWallet = await WalletModel.findOneAndUpdate(
                {user: userId},
                {$inc: {balance: -amount}},
                {new: true}
            )
                if(!updatedWallet || updatedWallet.balance < amount){
                    throw new httpError.BadRequest(WalletMsg.NoBalance)
                }

                const transaction = new TransactionModel({
                    amount,
                    type: 'withdrawal',
                    status: 'completed',
                    currency: updatedWallet.currency,
                    description: 'funds withdrawn from wallet',
                    order: null,
                    user: userId
                })

                await transaction.save()


            const responseWallet = {
                _id: updatedWallet._id,
                balance: updatedWallet.balance,
                currency: updatedWallet.currency
            }

            return sendResponse(res, StatusCodes.OK, WalletMsg.WithdrawnFund, {wallet: responseWallet})
            
        } catch (error) {
            next(error)
        }
    }

}

module.exports = {
    WalletController: new WalletController()
}