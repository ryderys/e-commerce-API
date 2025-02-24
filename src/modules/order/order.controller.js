const { CartModel } = require("../cart/cart.model");
const httpError = require("http-errors");
const { OrderMsg } = require("./order.msg");
const { shippingSchema, StatusSchema } = require("../../common/validations/order.validation");
const { ProductModel } = require("../products/product.model");
const { OrderModel } = require("./order.model");
const { sendResponse } = require("../../common/utils/helperFunctions");
const { StatusCodes } = require("http-status-codes");
const autoBind = require("auto-bind");
const { WalletModel } = require("../wallet/wallet.model");
const { TransactionModel } = require("../transaction/transaction.model");

class OrderController {
    constructor() {
        autoBind(this)
    }

    async createOrder(req, res, next){
        try {
             // Create order from cart
            const userId = req.user._id;

            // 1. Validate shipping information
            const {error, value} = shippingSchema.validate(req.body);
            if(error) throw new httpError.BadRequest(error.details[0].message)
                // 2. Get and validate cart
            const cart = await CartModel.findOne({userId})
            .populate('items.productId')

            if(!cart || cart.items.length === 0) throw new httpError.NotFound(OrderMsg.CartNFound)
            // 3. Validate cart items and stock
            const validItems = []
            const invalidItems = []

            for (const item of cart.items) {
                const numericQuantity = Number(item.quantity)
                if (isNaN(numericQuantity) || numericQuantity <= 0) {
                    invalidItems.push(item.productId._id);
                    continue;
                  }
                
                const product = item.productId
                if (!product || product.count < numericQuantity) {
                    invalidItems.push(item.productId._id);
                    continue
                }
                validItems.push({
                    product: product._id,
                    quantity: numericQuantity,
                    price: product.price
                })
            }

            if(invalidItems.length > 0){
                throw new httpError.BadGateway(OrderMsg.InvalidItems, {invalidItems})
            }

            // 4. Calculate total amount

            const totalAmount = validItems.reduce((sum, item) => sum + (item.quantity * item.price), 0)
            // 5. Create order

            const userWallet = await WalletModel.findOne({user: userId})
            if(!userWallet|| userWallet.balance < totalAmount){
                throw new httpError.BadRequest(OrderMsg.InsufficientFunds)
            }

            const order = new OrderModel({
                user: userId,
                products: validItems,
                totalAmount,
                shippingInfo: {
                    address: value.address,
                    city: value.city,
                    state: value.state,
                    zipCode: value.zipCode,
                    country: value.country,
                },
                paymentMethod: value.paymentMethod,
                paymentStatus: 'pending'
            })

            const transaction = new TransactionModel({
                amount: totalAmount,
                type: 'purchase',
                status: 'completed',
                currency: userWallet.currency,
                order: order._id
            })
            await transaction.save()

            userWallet.balance -= totalAmount;
            userWallet.transaction.push(transaction._id)
            await userWallet.save()

            // 6. Update product stock

            const bulkOps = validItems.map(item => ({
                updateOne: {
                    filter: { _id: item.product},
                    update: { $inc: { count: -item.quantity}}
                }
            }))

            await ProductModel.bulkWrite(bulkOps);

            const updatedItems = cart.items.map(item => {
                const validItem = validItems.find(vItem => vItem.product.toString() === item.productId._id.toString())
                if(validItem){
                    item.quantity -= validItem.quantity
                }
                return item
            }).filter(item => item.quantity > 0)

            const totalQuantity = updatedItems.reduce((sum, item) => sum + item.quantity, 0)

            // 7. Save order and clear cart
            order.paymentStatus = 'completed'
            await order.save()

            await CartModel.findByIdAndUpdate(cart._id, 
                { $set: {items: [], totalPrice: 0, totalQuantity}}
            )
        
            return sendResponse(res, StatusCodes.CREATED, OrderMsg.OrderCreated, {
                order: this._formatOrder(order),
                walletBalance: userWallet.balance
            })
        } catch (error) {
            next(error)
        }
    }

    async getOrder(req, res, next){
        try {
            const orders = await OrderModel.find({user: req.user._id})
                .populate('products.product', 'title price images')
                .sort('-createdAt')
            return sendResponse(res, StatusCodes.OK, null, {orders: orders.map(order => this._formatOrder(order))})
        } catch (error) {
            next(error)
        }
    }
    async getOrderDetails(req, res, next){
        try {
            const {orderId} = req.params
            const order = await OrderModel.findById(orderId)            
                .populate('products.product', 'title summary category')
                // .populate('user', 'name email mobile') 
            if(!order) throw new httpError.NotFound(OrderMsg.OrderNFound)
            return sendResponse(res, StatusCodes.OK, null, {order: this._formatOrder(order)})
        } catch (error) {
            next(error)
        }
    }

    async cancelOrder(req, res, next){
        try {
            const order = await OrderModel.findByIdAndUpdate(
                {
                    _id: req.params.orderId,
                    user: req.user._id,
                    status: 'pending'
                },
                {status: 'canceled'},
                {new: true}
                ).populate('products.product')

            if(!order) throw new httpError.NotFound(OrderMsg.OrderNFound)
            const bulkOps = order.products.map(item => ({
                updateOne: {
                    filter: { _id: item.product._id},
                    update: { $inc: {count: item.quantity}}
                }
            }))

            await ProductModel.bulkWrite(bulkOps)
            return sendResponse(res, StatusCodes.OK, OrderMsg.OrderCancelled, {order: this._formatOrder(order)})
        } catch (error) {
            next(error)
        }
    }
    
    async updateOrderStatus(req, res, next){
        try {
            const {orderId} = req.params
            const {error, value} = StatusSchema.validate(req.body)
            if(error) throw new httpError.BadRequest(error.details[0].message)

            const order = await OrderModel.findByIdAndUpdate(orderId, {
                status: value.status,
                ...(value.trackingNumber && {trackingNumber: value.trackingNumber})
            },
            { new: true}
            )

            if(!order) throw new httpError.NotFound(OrderMsg.OrderNFound)
            return sendResponse(res, StatusCodes.OK, OrderMsg.OrderUpdated, {order: this._formatOrder(order)})
            
        } catch (error) {
            next(error)
        }
    }

    _formatOrder(order) {
        return {
          id: order._id,
          status: order.status,
          createdAt: order.createdAt,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          trackingNumber: order.trackingNumber,
          shippingInfo: order.shippingInfo,
          products: order.products.map(item => ({
              product: {
                  id: item.product._id,
                  name: item.product.title,
                  price: item.product.price,
                  images: item.product.images,
                  quantity: item.quantity,
                  price: item.price
                },
            })),
            totalPrice: order.totalAmount,
        };
      }
    
}


module.exports = {
    OrderController: new OrderController()
}