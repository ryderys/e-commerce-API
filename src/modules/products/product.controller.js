const autoBind = require("auto-bind");
const { createProductSchema, updateProductSchema } = require("../../common/validations/product.validation");
const { ProductModel } = require("./product.model");
const { ProductMsg } = require("./product.msg");
const { getCategoryFeatures, convertFeaturesToObject, validateFeatures, sendResponse, deleteUploadedFiles } = require("../../common/utils/helperFunctions");
const { StatusCodes } = require("http-status-codes");
const httpErrors = require("http-errors");
const ObjectIdValidator = require("../../common/validations/public.validation");
class ProductController {
    constructor(){
        autoBind(this)
    }
    async addProduct(req, res, next){
        try {
            if (!req.user || !req.user._id) {
                throw new httpErrors.Unauthorized(ProductMsg.UserNotFound);
              }

            const images = Array.isArray(req.files) ? req.files.map((file) => file.path.slice(7)) : [];
            const productBody = await createProductSchema.validateAsync(req.body)
            let {title, summary, description, price, tags, count, category, features } = productBody;
            const supplier = req.user._id;

            const categoryFeatures = await getCategoryFeatures(category)
            const categoryFeaturesObject = convertFeaturesToObject(categoryFeatures);
            const validatedFeatures = validateFeatures(features, categoryFeaturesObject);

            const product = await ProductModel.create({
                title,
                summary,
                description,
                price,
                tags,
                count,
                supplier,
                images,
                features: validatedFeatures,
                category
            })

            return sendResponse(res, StatusCodes.CREATED, ProductMsg.ProductCreated, {product})
            } catch (error) {
                await this.deleteUploadedFiles(req?.files)
                next(error)
            }
    }

    async updateProduct(req, res, next){
        try {
            const {id} = req.params;
            if(!id) throw new httpErrors.BadRequest(ProductMsg.NoID)
            
            const updates = await updateProductSchema.validateAsync(req.body);
            if(Object.keys(updates).length === 0){
                throw new httpErrors.BadRequest(ProductMsg.NoUpdate)
            }

            const product = await this.findProductById(id)

             // Image handling
            if (req?.files?.length > 0) {
                if (product.images && product.images.length > 0) {
                await deleteUploadedFiles(product.images);
                }
                
                const newImages = await this.uploadFiles(req.files);
                updates.images = newImages;
            } else if (!updates.images) {
                updates.images = product.images || [];
            } else if (typeof updates.images === "string") {
                updates.images = [updates.images];
            }

            if(updates.features){
                const categoryFeatures = await getCategoryFeatures(product.category)
                const categoryFeaturesObject =  convertFeaturesToObject(categoryFeatures)
                updates.features =  validateFeatures(updates.features, categoryFeaturesObject)
            }

            Object.assign(product, updates)
            await product.save()

            return sendResponse(res, StatusCodes.OK, ProductMsg.ProductUpdated, {product})

        } catch (error) {
            if(req?.files?.length > 0){
                await this.deleteUploadedFiles(req?.files)
            }
            next(error)
        }
    }
    

    async findProductById(productId){
        try {
            const {id} = await ObjectIdValidator.validateAsync({id: productId})
            const product = await ProductModel.findById(id)
            if(!product) throw new httpErrors.NotFound(ProductMsg.ProductNotFound)
            return product
        } catch (error) {
            next(error)
        }
    }

    

    

    

   
}