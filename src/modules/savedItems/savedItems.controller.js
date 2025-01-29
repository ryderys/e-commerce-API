const HttpError = require("http-errors");
const { SavedItemsModel } = require("./savedItem.model");
const { SavedItemsMsg } = require("./savedItem.msg");
const { sendResponse } = require("../../common/utils/helperFunctions");
const httpErrors = require("http-errors");
const { StatusCodes } = require("http-status-codes");
const { CartModel } = require("../cart/cart.model");
const { ProductModel } = require("../products/product.model");

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
            const savedItems = await SavedItemsModel.find({userId}).populate('productId').lean()
            if(!savedItems || savedItems.length === 0){
                throw new HttpError.NotFound(SavedItemsMsg.ItemNFound)
            }

            const organizedItems = savedItems.map(item => {
                const {productId: savedProductId, savedAt, _id, ...rest} = item;
                const { _id: productId, ...productDetails } = savedProductId || {};                
                return {
                    product: {id: productId, ...productDetails},
                    savedAt,
                    ...rest
                } 
            })

            return sendResponse(res, StatusCodes.OK, null, {savedItems: organizedItems})
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

    // async addSavedItemToCart(req, res, next){
    //     try {
    //         const {productId, quantity} = req.body
    //         const userId = req.user._id;

    //         if(!userId){
    //             throw new httpErrors.Unauthorized(SavedItemsMsg.NotAuthenticated)
    //         }
            
    //         const savedItem = await SavedItemsModel.findOne({userId, productId})
    //         if(!savedItem) throw new httpErrors.NotFound(SavedItemsMsg.ItemNFound)
            
    //         const existingCartItem = await CartModel.findOne({userId, productId})
            
    //         if(existingCartItem){
    //             existingCartItem.quantity += quantity
    //             await existingCartItem.save()
    //             return sendResponse(res, StatusCodes.OK, SavedItemsMsg.ItemAddedToCart)
    //         } 

    //         const newCartItem = new CartModel({userId, productId, quantity})
    //         await newCartItem.save()
    //         return sendResponse(res, StatusCodes.CREATED, SavedItemsMsg.ItemAddedToCart)


    //     } catch (error) {
    //         next(error)
    //     }
    // }

    //more complex way
    async addSavedItemToCart(req, res, next) {
        try {
            const { productId, quantity = 1 } = req.body; // Default quantity to 1 if not provided
            const userId = req.user._id;
    
            // Ensure the user is authenticated
            if (!userId) {
                throw new httpErrors.Unauthorized(SavedItemsMsg.NotAuthenticated);
            }
    
            // Find the saved item for the user
            const savedItem = await SavedItemsModel.findOne({ userId, productId });
            if (!savedItem) {
                throw new httpErrors.NotFound(SavedItemsMsg.ItemNFound);
            }
    
            // Find the user's cart
            let cart = await CartModel.findOne({ userId });
            if (!cart) {
                // If no cart exists, create a new cart
                cart = new CartModel({ userId, items: [] });
            }
    
            // Check if the item already exists in the cart
            const existingCartItem = cart.items.find(item => item.productId.toString() === productId);
            
            if (existingCartItem) {
                // If the item exists, update its quantity and recalculate the total
                existingCartItem.quantity += quantity;
            } else {
                // If the item doesn't exist, add it to the cart
                const product = await ProductModel.findById(productId);
                if (!product) {
                    throw new httpErrors.NotFound(SavedItemsMsg.ProductNotFound);
                }
    
                cart.items.push({
                    productId,
                    quantity,
                    price: product.price,
                });
            }
    
            // Recalculate total quantity and price
            cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
            cart.totalPrice = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    
            // Save the updated cart
            await cart.save();
    
            // Send success response
            return sendResponse(res, StatusCodes.OK, SavedItemsMsg.ItemAddedToCart, { cart });
    
        } catch (error) {
            next(error);
        }
    }
    

}


module.exports = {
    SavedItemsController: new SavedItemsController()
}