const { default: slugify } = require("slugify");
const { checkExistCategoryById, checkExistsFeatureByCategoryAndKey, sendResponse } = require("../../common/utils/helperFunctions");
const { createFeatureSchema } = require("../../common/validations/features.validation")
const { FeaturesModel } = require("./features.model");
const { StatusCodes } = require("http-status-codes");
const { FeaturesMSG } = require("./features.msg");

class FeaturesController{


    async addFeatures(req, res, next){
        try {
            const featureBody = await createFeatureSchema.validateAsync(req.body);
            let {title, key , type, list, guid, category} = featureBody;

            const {_id: categoryId } = await checkExistCategoryById(category)

            key = slugify(key || title, {trim: true, replacement: "_", lower: true})

            await checkExistsFeatureByCategoryAndKey(key, categoryId)

            if(list && typeof list === "string"){
                list = list.split(",").map(item => item.trim())
            } else if(!Array.isArray(list)){
                list = []
            }

            const feature = await FeaturesModel.create({title, key, type, list, guid, category: categoryId})

            return sendResponse(res, StatusCodes.CREATED, FeaturesMSG.FeatureCreated, {feature})

        } catch (error) {
            next(error)
        }
    }

}