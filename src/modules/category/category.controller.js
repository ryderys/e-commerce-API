const autoBind = require("auto-bind");
const { createCategorySchema } = require("./category.validation");
const { isValidObjectId, Types } = require("mongoose");
const { CategoryModel } = require("./category.model");
const httpErrors = require("http-errors");
const { CategoryMSG } = require("./category.msg");
const { default: slugify } = require("slugify");
const { sendResponse, deleteCategoryAndChildren, checkCategorySlugUniqueness, checkExistCategoryById } = require("../../common/utils/helperFunctions");
const StatusCodes = require("http-status-codes");

class CategoryController{
    constructor(){
        autoBind(this)
    }

    async createCategory(req, res, next){
        try {
            const ValidatedCategory = await createCategorySchema.validateAsync(req.body);
            let {title, icon, slug, parent} = ValidatedCategory;
            let parents = []
            if(parent && isValidObjectId(parent)){
                const existingCategory = await checkExistCategoryById(parent)

                parent = existingCategory._id;

                parents = [
                    ...new Set(
                        ([existingCategory._id.toString()]
                            .concat(existingCategory.parents.map(id => id.toString())
                    )).map(id => new Types.ObjectId(id))
                )
                ]
            }
            slug = slugify(slug || title)

            await checkCategorySlugUniqueness(slug)
            const newCategory = await CategoryModel.create({title, icon, slug, parent, parents})

            if(parent){
                await CategoryModel.findByIdAndUpdate(parent, {
                    $push: {children: newCategory._id}
                })
            }
            return sendResponse(res, StatusCodes.CREATED, CategoryMSG.CategoryCreated, {newCategory} )
        } catch (error) {
            next(error)
        }
    }

    async getAllCategories(req, res, next){
        try {
            const categories = await CategoryModel.find({parent: {$exists: false}}).select("title")
            if(!categories || categories.length === 0) throw new httpErrors.BadRequest(CategoryMSG.CategoryNotFound)
                
            return sendResponse(res, StatusCodes.OK, null , {categories})
        } catch (error) {
            next(error)
        }
    }

    async deleteCategoryById(req, res, next){
        try {
            const {id} = req.params;
            
            if(!isValidObjectId(id)){
                throw new httpErrors.BadRequest(CategoryMSG.InvalidCategoryId)
            }

            await deleteCategoryAndChildren(id)

            return sendResponse(res, StatusCodes.OK ,CategoryMSG.CategoryDeleted)
        } catch (error) {
            next(error)
        }
    }



    


    

    
}


module.exports = {
    CategoryController: new CategoryController()
}