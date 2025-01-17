const autoBind = require("auto-bind");
const { createProductSchema, updateProductSchema } = require("../../common/validations/product.validation");
const { ProductModel } = require("./product.model");
const { ProductMsg } = require("./product.msg");
const { getCategoryFeatures, convertFeaturesToObject, validateFeatures, sendResponse, deleteUploadedFiles, uploadFiles } = require("../../common/utils/helperFunctions");
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
            }

            return sendResponse(res, StatusCodes.CREATED, ProductMsg.ProductCreated, {filteredProduct})
            } catch (error) {
                await deleteUploadedFiles(req?.files)
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
                
                const newImages =  uploadFiles(req.files);
                updates.images = newImages;
            } else if (!updates.images) {
                updates.images = product.images || [];
            } else if (typeof updates.images === "string") {
                updates.images = [updates.images];
            }

            if(updates.features){
                const categoryFeatures = getCategoryFeatures(product.category)
                const categoryFeaturesObject = convertFeaturesToObject(categoryFeatures)
                updates.features =  validateFeatures(updates.features, categoryFeaturesObject)
            }

            Object.assign(product, updates)
            await product.save()

            return sendResponse(res, StatusCodes.OK, ProductMsg.ProductUpdated, {product})

        } catch (error) {
            if(req?.files?.length > 0){
                await deleteUploadedFiles(req?.files)
            }
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
                  slug: "$category.slug",
                  icon: "$category.icon",
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
      
          return sendResponse(res, StatusCodes.OK, null,  {products, pagination: {page, limit}})

        } catch (error) {
          next(error);
        }
      }

    async getOneProductById(req, res, next){
        try {
            const {id} = req.params;
            if(!id) throw new httpErrors.BadRequest(ProductMsg.NoID)
            const product = await this.findProductById(id)
            return sendResponse(res, StatusCodes.OK, null, {product})
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
            const product = await ProductModel.findById(id)
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