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
    
            //  Retrieve the product and check stock
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
                cart.items.push({productId, quantity: numericQuantity, price: product.price})
            }

            const {validCart, invalidItems} = await validateCart(cart)
            if(invalidItems.length > 0){
               return sendResponse(res, StatusCodes.BAD_REQUEST,
                   CartMsg.InvalidCartItems, {invalidItems})
               }

            cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
            cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    
            
            await validCart.save()
             // Validate cart and set expiration if needed

            await expireCart(cart, Date.now() + 30 * 60 * 1000)
            return sendResponse(res, StatusCodes.OK, CartMsg.AddToCartSuccess, {
                cart: {
                    id: validCart._id,
                    items: validCart.items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    })),
                    totalQuantity: validCart.totalQuantity,
                    totalPrice: validCart.totalPrice
                }
            })
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
            cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
            cart.totalPrice = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
            await cart.save();
            
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
                // console.log('Cart Before Validation:', JSON.stringify(cart, null, 2));  // Log the cart here
            const {validCart} = await validateCart(cart)
            // console.log('Valid Cart:', JSON.stringify(validCart, null, 2)); // Log the valid cart after validation
            const sanitizedCart = {
                id: validCart._id,
                items: validCart.items.map(item => ({
                    productId: item.productId._id,
                    title: item.productId.title,
                    images: item.productId.images,
                    quantity: item.quantity,
                    price: item.price,
                    total: item.quantity * item.price
                })),
                totalQuantity: validCart.totalQuantity,
                totalPrice: validCart.totalPrice
            };

            return sendResponse(res, StatusCodes.OK, CartMsg.CartRetrieved, {...sanitizedCart})
        } catch (error) {
            next(error)
        }
    }

    async clearCart(req, res, next){
        const userId = req.user._id;
        const cart = await CartModel.findOne({userId})
        if(!cart) throw new httpErrors.NotFound(CartMsg.CartNFound)
        cart.items = []
        cart.totalQuantity = 0
        cart.totalPrice = 0
        await cart.save()
        return sendResponse(res, StatusCodes.OK, CartMsg.CartCleared, {cart})
    }

}

module.exports = {
    CartController: new CartController()
}