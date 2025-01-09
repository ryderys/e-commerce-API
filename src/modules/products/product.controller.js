const autoBind = require("auto-bind");
const { createProductSchema } = require("../../common/validations/product.validation");
const { ProductModel } = require("./product.model");
const { ProductMsg } = require("./product.msg");
const { getCategoryFeatures, convertFeaturesToObject, validateFeatures, sendResponse } = require("../../common/utils/helperFunctions");
const { StatusCodes } = require("http-status-codes");
class ProductController {
    constructor(){
        autoBind(this)
    }
    async addProduct(req, res, next){
        try {
            if (!req.user || !req.user._id) {
                throw new httpError.Unauthorized("No user found in request. Please log in.");
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

    

    

    

   
}