const autoBind = require("auto-bind");
const { CartModel } = require("./cart.model");
const httpErrors = require("http-errors");
const { CartMsg } = require("./cart.msg");
const { AddToCartSchema, RemoveFromCartSchema } = require("../../common/validations/cart.validation");
const ObjectIdValidator = require("../../common/validations/public.validation");
const { findProductById, validateCart, expireCart, sendResponse } = require("../../common/utils/helperFunctions");
const { StatusCodes } = require("http-status-codes");

class CartController{
    constructor(){
        autoBind(this)
    }

    async getOrCreateCart(userId){
        try {
            let cart = await CartModel.findOne({userId})
            if(!cart){
                cart = new CartModel({userId, items: []})
                await cart.save()
            }
            return cart
        } catch (error) {
            next(error)
        }
    }

    async addItemToCart(req, res, next){
        try {
            if(!req.user || !req.user._id){
                throw new httpErrors.Unauthorized(CartMsg.UserNotFound)
            }
            const cartBody = await AddToCartSchema.validateAsync(req.body)
            const {productId, quantity} = cartBody;
            const userId = req.user._id;
    
            // Ensure quantity is a positive number
            const numericQuantity = Number(quantity)
            if(isNaN(numericQuantity) || numericQuantity <= 0){
                throw new httpErrors.BadRequest(CartMsg.InvalidQuantity)
            }
    
             // Retrieve the product and check stock
            const product = await findProductById(productId)
            if(product.count < numericQuantity){
                throw new httpErrors.BadRequest(CartMsg.InsufficientStock)
            }
    
            // Retrieve or create the user's cart
            let cart = await this.getOrCreateCart(userId)
    
            // Find if the item already exists in the cart
            const existingItem = cart.items.find(item => item.productId.equals(productId))
            if (existingItem){
                // Update quantity if item exists
                existingItem.quantity += numericQuantity
            }else {
                // Otherwise, add a new item to the cart
                cart.items.push({productId, quantity: numericQuantity})
            }
    
            await cart.save()
             // Validate cart and set expiration if needed
            await validateCart(cart)
            await expireCart(cart, Date.now() + 30 * 60 * 1000)
            return sendResponse(res, StatusCodes.OK, CartMsg.AddToCartSuccess)
        } catch (error) {
            next(error)
        }
    }

    async removeItemFromCart(req, res, next){
        try {
            await RemoveFromCartSchema.validateAsync(req.params)
            const {productId} = req.params;
            if(!req.user || !req.user._id) throw new httpErrors.Unauthorized(CartMsg.UserNotFound)
            const userId = req.user._id;

            const cart = await CartModel.findOneAndUpdate(
                {userId},
                { $pull: {items: {productId}}},
                { new: true}
            )
            if(!cart) throw new httpErrors.NotFound(CartMsg.CartNFound)
            const itemStillExist = cart.items.some((item) => item.productId.toString() === productId)
            if(itemStillExist) throw new httpErrors.BadRequest(CartMsg.ItemNotInCart)
            
            return sendResponse(res, StatusCodes.OK, CartMsg.DeletedSuccess, {cart})

        } catch (error) {
            next(error)
        }
    }

    async getCart(req, res, next){
        try {
            const userId = req.user._id;
            const cart = await CartModel.findOne({userId}).populate('items.productId')
            if(!cart) throw new httpErrors.NotFound(CartMsg.CartNFound)

            const validatedCart = await validateCart(cart)

            return this.sendCartResponse(res, validatedCart)
        } catch (error) {
            next(error)
        }
    }

    sendCartResponse(res, cart, message = null){
        const items = Array.isArray(cart.item) ? cart.items.map(item => ({
            id: item._id,
            productId: item.productId,
            quantity: item.quantity,
            productName: item.productId ? item.productId.name : null,
            productPrice: item.productId ? item.productId.price : null,
        })) : [] 
        
        const cartResponse = {
            _id: cart._id,
            userId: cart.userId,
            items,
            expiresAt: cart.expiresAt
        }
        const responseData = {cart: cartResponse}
        if(message){
            responseData.message = message
        }
        return sendResponse(res, StatusCodes.OK, null, {responseData})
    }
}

module.exports = {
    CartController: new CartController()
}