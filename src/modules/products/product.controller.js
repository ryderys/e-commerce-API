const autoBind = require("auto-bind");
const path = require("path")
const { createProductSchema, updateProductSchema } = require("../../common/validations/product.validation");
const { ProductModel } = require("./product.model");
const { ProductMsg } = require("./product.msg");
const { getCategoryFeatures, convertFeaturesToObject, validateFeatures, sendResponse, deleteUploadedFiles, uploadFiles, formatProductFeatures } = require("../../common/utils/helperFunctions");
const { StatusCodes } = require("http-status-codes");
const httpErrors = require("http-errors");
const ObjectIdValidator = require("../../common/validations/public.validation");
const { default: mongoose } = require("mongoose");


class ProductController {
    constructor(){
        autoBind(this)
    }
    async addProduct(req, res, next){
        try {
            if (!req.user || !req.user._id) {
                throw new httpErrors.Unauthorized(ProductMsg.UserNotFound);
              }

            const images = Array.isArray(req.files) ? req.files.map((file) => path.basename(file.path)) : [];
           
            if(typeof req.body.features === 'string'){
                req.body.features = JSON.parse(req.body.features)
            }
            if(!Array.isArray(req.body.features)){
                throw new httpErrors.BadRequest("Invalid features format. Must be a valid JSON string.")
            }
            
                
            const productBody = await createProductSchema.validateAsync({...req.body, features: req.body.features},
                {stripUnknown: true}
            )
            
            let {title, summary, description, price, tags, count, category, features } = productBody;

            const existingProduct = await ProductModel.findOne({
                title: title.trim(),
                category
            })
            if(existingProduct){
                throw new httpErrors.Conflict(ProductMsg.ProductExist)
            }
            
            const supplier = req.user._id;
            

            const categoryFeatures = await getCategoryFeatures(category)
            const categoryFeaturesObject = convertFeaturesToObject(categoryFeatures);

            // Validate the provided features against category features
            const validatedFeatures = validateFeatures(features, categoryFeaturesObject, true);


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
            console.log(product)
            
            const filteredProduct = {
                id: product._id,
                title: product.title,
                count: product.count,
                summary: product.summary,
                description: product.description,
                category: product.category,
                price: product.price,
                images: product.images,
                tags: product.tags,
                features: product.features
            }

            return sendResponse(res, StatusCodes.CREATED, ProductMsg.ProductCreated, {filteredProduct})
            } catch (error) {
                await deleteUploadedFiles(req?.files)
                next(error)
            }
    }

    async updateProduct(req, res, next){
        try {
            const {productId} = req.params;
            if(!mongoose.Types.ObjectId.isValid(productId)) throw new httpErrors.BadRequest(ProductMsg.InvalidId)
            if(!productId) throw new httpErrors.BadRequest(ProductMsg.NoID)

            if(!req.user || !req.user._id){
                throw new httpErrors.Unauthorized(ProductMsg.UserNotFound)
            }

            const images = Array.isArray(req.files) ? req.files.map((file) => path.basename(file.path)) : product.images;

            if(req.body.features && typeof req.body.features === 'string'){
                req.body.features = JSON.parse(req.body.features)
            }
            if(req.body.features && !Array.isArray(req.body.features)){
                throw new httpErrors.BadRequest(ProductMsg.InvalidFeature)
            }

            const updateData = await updateProductSchema.validateAsync({...req.body, features: req.body.features}, {stripUnknown: true});
            const {title, summary , description ,category, features , price, tags, count} = updateData

            const product = await this.findProductById(productId)
            if(title && category){
                const existingProduct = await ProductModel.findOne({
                    _id: {$ne: productId},
                    title: title.trim(),
                    category
                })
                if(existingProduct){
                    throw new httpErrors.Conflict(ProductMsg.ProductExist)
                }
            }
            let validatedFeatures = product.features;
            if(features){
                const categoryFeatures = await getCategoryFeatures(category || product.category)
                const categoryFeaturesObject = convertFeaturesToObject(categoryFeatures)
                validatedFeatures = validateFeatures(features, categoryFeatures, true)
            }

            Object.assign(product, {...updateData, images, features: validatedFeatures})
            await product.save()
            const filteredProduct = {
                id: product._id,
                title: product.title,
                count: product.count,
                summary: product.summary,
                description: product.description,
                category: product.category,
                price: product.price,
                images: product.images,
                tags: product.tags,
                features: product.features
            };
            return sendResponse(res, StatusCodes.OK, ProductMsg.ProductUpdated, {filteredProduct})

        } catch (error) {
            await deleteUploadedFiles(req?.files)
            next(error)
        }
    }

    async getAllProducts(req, res, next) {
        try {
          const search = req?.query?.search?.trim() || "";
          let matchStage = {};
      
          if (search) {
            matchStage = {
              $text: { $search: search }
            };
          }
      
          // Pagination parameters
          const page = parseInt(req.query.page, 10) || 1;
          const limit = parseInt(req.query.limit, 10) || 10;
          const skip = (page - 1) * limit;
      
          const totalProducts = await ProductModel.aggregate([
            {$match: matchStage},
            {$count: 'total'}
          ])

          const totalItems = totalProducts.length > 0 ? totalProducts[0].total: 0;
          const totalPages = Math.ceil(totalItems / limit)

          const products = await ProductModel.aggregate([
            { $match: matchStage },
            {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
              }
            },
            { $unwind: "$category" },
            {
              $project: {
                _id: 0,
                id: "$_id",
                title: 1,
                summary: 1,
                description: 1,
                price: 1,
                count: 1,
                images: 1,
                tags: 1,
                features: 1,
                reviewCount: 1,
                averageRating: 1,
                supplier: 1,
                category: {
                  id: "$category._id",
                  title: "$category.title",
                  parent: "$category.parent",
                  children: "$category.children"
                },
                createdAt: 1,
                updatedAt: 1
              }
            },
            { $skip: skip },
            { $limit: limit }
          ]);
      
          return sendResponse(res, StatusCodes.OK, null,  {products, pagination: {page, limit, totalItems, totalPages}})

        } catch (error) {
          next(error);
        }
      }

    async getOneProductById(req, res, next){
        try {
            const {id} = req.params;
            if(!id) throw new httpErrors.BadRequest(ProductMsg.NoID)
            const product = await this.findProductById(id)
            const filteredProduct = {
                id: product._id,
                title: product.title,
                summary: product.summary,
                description: product.description,
                price: product.price,
                count: product.count,
                images: product.images,
                tags: product.tags,
                features: product.features,
                reviewCount: product.reviewCount,
                averageRating: product.averageRating,
                supplier: product.supplier,
                category: {
                    id: product.category._id,
                    title: product.category.title,
                    parent: product.category.parent,
                    children: product.category.children
                },
                createdAt: product.createdAt,
                updatedAt: product.updatedAt
            };
            return sendResponse(res, StatusCodes.OK, null, {filteredProduct})
        } catch (error) {
            next(error)
        }
    }

    async deleteProductById(req, res, next){
        try {
            const {id} = req.params;
            if(!id) throw new httpErrors.BadRequest(ProductMsg.NoID)
            
            const product = await this.findProductById(id)

            if(product.images && product.images.length > 0){
                await deleteUploadedFiles(product.images)
            }

            const {deletedCount} = await ProductModel.deleteOne({_id: product._id})
            if(deletedCount === 0){
                throw new httpErrors.InternalServerError(ProductMsg.ProductDeleteFailed)
            }

            return sendResponse(res, StatusCodes.OK, ProductMsg.ProductDeleted)

        } catch (error) {
            
        }
    }
      


    async findProductById(productId){
        try {
            const {id} = await ObjectIdValidator.validateAsync({id: productId})
            const product = await ProductModel.findById(id).populate('category').exec()
            if(!product) throw new httpErrors.NotFound(ProductMsg.ProductNotFound)
            return product
        } catch (error) {
            next(error)
        }
    }
   
}

module.exports = {
    ProductController: new ProductController()
}