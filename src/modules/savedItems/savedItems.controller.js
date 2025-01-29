const HttpError = require("http-errors");
const { SavedItemsModel } = require("./savedItem.model");
const { SavedItemsMsg } = require("./savedItem.msg");
const { sendResponse } = require("../../common/utils/helperFunctions");
const httpErrors = require("http-errors");
const { StatusCodes } = require("http-status-codes");

class SavedItemsController{
    constructor(){

    }
    async saveItemToBookmarks(req, res, next){
        try {
            const {productId} = req.body;
            const userId = req.user._id
            const existingBookmark = await SavedItemsModel.findOne({userId, productId})
            if(existingBookmark){
                throw new HttpError.BadRequest(SavedItemsMsg.AlreadyExists)
            }

            const savedItem = new SavedItemsModel({userId, productId})
            await savedItem.save()
            return sendResponse(res, StatusCodes.CREATED, SavedItemsMsg.ItemSaved)
            
        } catch (error) {
            next(error)
        }
    }
    async removeSavedItem(req, res, next){
        try {
            const {productId} = req.params;
            const userId = req.user._id
            const result = await SavedItemsModel.findOneAndDelete({userId, productId})
            if(!result){
                throw new HttpError.NotFound(SavedItemsMsg.ItemNFound)
            }

            
            return sendResponse(res, StatusCodes.OK, SavedItemsMsg.ItemRemoved)

        } catch (error) {
            next(error)
        }
    }

    async getSavedItems(req, res, next){
        try {
            const userId = req.user._id
            const savedItems = await SavedItemsModel.find({userId}).populate('items.productId')
            if(!savedItems || savedItems.length === 0){
                throw new HttpError.NotFound(SavedItemsMsg.ItemNFound)
            }

            return sendResponse(res, StatusCodes.OK, null, savedItems)
        } catch (error) {
            next(error)
        }
    }
    async clearSavedItems(req, res, next){
        try {
            const userId = req.user._id
            const result = await SavedItemsModel.deleteMany({userId})
            if(result.deletedCount === 0){
                throw new HttpError.NotFound(SavedItemsMsg.ItemNFound)
            }

            return sendResponse(res, StatusCodes.OK, SavedItemsMsg.SavedItemsCleared)
        } catch (error) {
            next(error)
        }
    }

}


module.exports = {
    SavedItemsController: new SavedItemsController()
}