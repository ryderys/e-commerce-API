const { default: slugify } = require("slugify");
const { checkExistCategoryById, checkExistsFeatureByCategoryAndKey, sendResponse } = require("../../common/utils/helperFunctions");
const { createFeatureSchema, updateFeatureSchema } = require("../../common/validations/features.validation")
const { FeaturesModel } = require("./features.model");
const { StatusCodes } = require("http-status-codes");
const { FeaturesMSG } = require("./features.msg");
const { default: mongoose } = require("mongoose");
const httpErrors = require("http-errors");
const autoBind = require("auto-bind");

class FeaturesController{
    constructor(){
        autoBind(this)
    }

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

    async updateFeatures(req, res, next){
        try {
            const {id} = req.params;
            if(!mongoose.Types.ObjectId.isValid(id)) throw new httpErrors.BadRequest(FeaturesMSG.InvalidId)
            
            const featureBody = await updateFeatureSchema.validateAsync(req.body)
            let {title, key, type, list, guid, category} = featureBody;
            
            const existingFeature = await this.checkExistFeatureById(id)

            if(category){
                const existingCategory = await checkExistCategoryById(category)
                category = existingCategory._id
            } else {
                category = existingFeature.category
            }

            if(key){
                key = slugify(key, {trim: true, replacement: "_", lower: true})
                await checkExistsFeatureByCategoryAndKey(key, category, id)
            }

            if(list && typeof list === "string"){
                list = list.split(",").map(item => item.trim())
            } else if(!Array.isArray(list)){
                list = []
            }

            const updatedData = {title, key, type, list, guid, category}
            Object.keys(updatedData).forEach((key) => {
                if(updatedData[key] === undefined) delete updatedData[key]
            })

            const updatedFeature = await FeaturesModel.findByIdAndUpdate(id, updatedData, {new: true})

            return sendResponse(res, StatusCodes.OK, FeaturesMSG.FeatureUpdated, {feature: updatedFeature})


        } catch (error) {
            next(error)
        }
    }

    async getAllFeatures(req, res, next){
        try {
            const features = await FeaturesModel.aggregate([
                {
                    $lookup: {
                        from: "categories",
                        localField: "category",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                {
                    $unwind: {
                        path: "$category",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: "$category._id",
                        category: {$first: "$category"},
                        features: {
                            $push: {
                                _id: "$_id",
                                title: "$title",
                                key: "$key",
                                type: "$type",
                                list: "$list",
                                guid: "$guid"
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        category:{
                            title: "$category.title",
                            _id: "$category._id"
                        },
                        features: 1
                    }
                },
                {
                    $sort: {"_id": -1}
                }
            ])
            if(!features.length){
                throw new httpErrors.BadRequest(FeaturesMSG.FeatureNotFound)
            }
            
            return sendResponse(res, StatusCodes.OK, null, {features})
        } catch (error) {
            next(error)
        }
    }

    async getFeaturesByCategoryId(req, res, next){
        const { categoryId } = req.params;
        if(!mongoose.Types.ObjectId.isValid(categoryId)){
            throw new httpErrors.BadRequest(FeaturesMSG.InvalidId)
        }
        const feature = await FeaturesModel.find({category: categoryId}, {__v: 0}).populate({path: "category", select: "name slug"})
        return sendResponse(res, StatusCodes.OK, null, {feature})
    }

    async removeFeatureById(req, res, next){
        try {
            const {id} = req.params;

            if(!mongoose.Types.ObjectId.isValid(id)){
                throw new httpErrors.BadRequest(FeaturesMSG.InvalidId)
            }
            const deletedFeature = await FeaturesModel.findOneAndDelete({_id: id})

            if(!deletedFeature){
                throw new httpErrors.NotFound(FeaturesMSG.FeatureNotFound)
            }

            return sendResponse(res, StatusCodes.OK, FeaturesMSG.FeatureDeleted)
        } catch (error) {
            next(error)
        }
    }

    async checkExistFeatureById(id){
        const feature = await FeaturesModel.findById(id);
        if(!feature) throw new httpErrors.NotFound(FeaturesMSG.InvalidId)
        return feature
    }

}

module.exports = {
    FeaturesController: new FeaturesController()
}