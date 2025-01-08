const autoBind = require("auto-bind");
const { createProductSchema } = require("../../common/validations/product.validation");
const { ProductModel } = require("./product.model");
const { ProductMsg } = require("./product.msg");
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

            const categoryFeatures = await this.getCategoryFeatures(category)
            const categoryFeaturesObject = this.convertFeaturesToObject(categoryFeatures);
            const validatedFeatures = this.validateFeatures(features, categoryFeaturesObject);

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
            return res.status(StatusCodes.CREATED).json({
                statusCode: StatusCodes.CREATED,
                data: {
                    message: ProductMsg.ProductCreated,
                    product
                }
            })
            } catch (error) {
                await this.deleteUploadedFiles(req?.files)
                next(error)
            }
    }

    async getCategoryFeatures(categoryId){
        const features = await FeaturesModel.find({category: categoryId})
        if(!features){
            throw new httpError.NotFound("No features found for the selected category")
        }
        return features
    }

    convertFeaturesToObject(features) {
        return features.reduce((obj, feature) => {
            obj[feature.key] = feature;
            return obj;
        }, {});
    }

    validateFeatures(providedFeatures, categoryFeatures) {
        const validatedFeatures = {};
        for (const key in providedFeatures) {
            if (categoryFeatures[key]) {
                validatedFeatures[key] = providedFeatures[key];
            } else {
                throw new httpError.BadRequest(`Feature '${key}' is not valid for the selected category`);
            }
        }
        return validatedFeatures;
    }

    async deleteUploadedFiles(files){
        if(!files) return;
        try {
            files.forEach(file => {
                deleteFileInPublic(file.path.slice(7))
            })
        } catch (error) {
            console.error('file deletion error:', error)   
        }
    }
}