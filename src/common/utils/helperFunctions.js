const jwt = require("jsonwebtoken")
const httpErrors = require("http-errors")
const { AuthMSG } = require("../../modules/auth/auth.msg")
const crypto = require("crypto")
const bcrypt = require("bcrypt")
const path = require("path")
const { FeaturesModel } = require("../../modules/features/features.model")
const CookieNames = require("../constants/cookieEnum")
const { CategoryModel } = require("../../modules/category/category.model")
const { CategoryMSG } = require("../../modules/category/category.msg")
const { FeaturesMSG } = require("../../modules/features/features.msg")
const ObjectIdValidator = require("../validations/public.validation")
const { ProductModel } = require("../../modules/products/product.model")
const { CartMsg } = require("../../modules/cart/cart.msg")
const { ProductMsg } = require("../../modules/products/product.msg")
const { default: mongoose } = require("mongoose")
const fs = require("fs").promises;

const sendResponse = (res, statusCode, message = null , data = {}) => {
    const responseData = {
        statusCode,
        data: {
            ...data
        }
    }
    if(message){
        responseData.data.message = message
    }

    return res.status(statusCode).json(responseData)
}

// AUTH HELPER FUNCTIONS________________________

const signToken = {
    signAccessToken: (payload) => {
        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "1h"})
    },
    signRefreshToken: (payload) => {
        return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "7d"})
    }
}

const verifyRefreshToken = (token, secret) => {
    try {
        return jwt.verify(token, secret)
    } catch (error) {
        throw new httpErrors.Unauthorized(AuthMSG.InvalidRefreshToken)
    }
}

const hashingUtils = {
    hashOTP: (otp) => {
        return crypto.createHash("sha256").update(otp.toString()).digest("hex")
    },
    hashRefreshToken: (token) => {
        const saltRounds = 10
        return bcrypt.hash(token, saltRounds)
    },
    compareRefreshToken: (token, hashed) => {
        return bcrypt.compare(token, hashed)
    }
}

const setToken = (res, accessToken, refreshToken) => {
  return res
    .cookie(CookieNames.AccessToken, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60,
    })
    .cookie(CookieNames.RefreshToken, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7, //7 days
    });
} 

// PRODUCT HELPER FUNCTIONS ___________________________

async function getCategoryFeatures(categoryId){
  if(!mongoose.Types.ObjectId.isValid(categoryId)){
    throw new httpErrors.BadRequest("Invalid category ID format")
  }
  const features = await FeaturesModel.find({category: categoryId})
  if (!features || features.length === 0) {
      throw new httpErrors.NotFound("No features found for the selected category");
    }
  return features
}

function convertFeaturesToObject(features) {
    return features.reduce((obj, feature) => {
      if(!feature.key || !Array.isArray(feature.list)){
        console.warn(`Skipping invalid feature: ${JSON.stringify(feature)}`)
      }
      if(obj[feature.key]){
        console.warn(`Duplicate feature key found: '${feature.key}'`)
      }
      obj[feature.key] = feature.list;
      return obj;
    }, {});
  }

  // function validateFeatures(providedFeatures, categoryFeatures) {
  //   const validatedFeatures = {};
  //   for (const key in providedFeatures) {
  //     if (categoryFeatures[key]) {
  //       validatedFeatures[key] = providedFeatures[key]; // Store valid features and their values
  //     } else {
  //       throw new httpErrors.BadRequest(`Feature '${key}' is not valid for the selected category`);
  //     }
  //   }
  //   return validatedFeatures;
  // } previous one

  function validateFeatures(providedFeatures, categoryFeatures, allowedCustomValues = true) {
    const validatedFeaturesMap = new Map();
  
    providedFeatures.forEach(featureObj => {
      const { feature, values } = featureObj;

      if(!feature || !Array.isArray(values)){
        throw new httpErrors.BadRequest(`Invalid feature format. Feature must have a 'feature' name and an array of 'values'.`)
      }

      const normalizedFeature = feature.toLowerCase()
      const normalizedValues = values.map(val => val.trim().toLowerCase())

      // Validate against category features
      if (categoryFeatures[normalizedFeature]) {
        const allowedValues = categoryFeatures[normalizedFeature].map(val => val.toLowerCase());
  
        if(!allowedCustomValues){
          const invalidValues = normalizedValues.filter(val => !allowedValues.includes(val))
          if (invalidValues.length < 0){
            throw new httpErrors.BadRequest(`Invalid value(s) for feature '${feature}': ${invalidValues.join(", ")}.`)
          }
        }

        if(validatedFeaturesMap.has(feature)){
          const existingValues = validatedFeaturesMap.get(feature)
          const mergedValues = Array.from(new Set([...existingValues, ...values]))
          validatedFeaturesMap.set(feature, mergedValues)
        } else {
          validatedFeaturesMap.set(feature, values)
        }
      }

      else if(allowedCustomValues){
        if (validatedFeaturesMap.has(feature)){
          const existingValues = validatedFeaturesMap.get(feature)
          const mergedValues = Array.from(new Set([...existingValues, ...values]))
          validatedFeaturesMap.set(feature, mergedValues)
        } else {
          validatedFeaturesMap.set(feature, values)
        }
      } 
      
      else {
        throw new httpErrors.BadRequest(`Feature '${feature}' is not recognized.`);
      }
    });
    const validatedFeatures = Array.from(validatedFeaturesMap.entries()).map(([feature, values]) => ({
      feature,
      values
    }))
    return validatedFeatures;
  }

  // function validateFeatures(providedFeatures, categoryFeatures, allowedCustomValues = true) {
  //   const validatedFeatures = [];
  
  //   providedFeatures.forEach(featureObj => {
  //     const { feature, values } = featureObj;

  //     if(!feature || !Array.isArray(values)){
  //       throw new httpErrors.BadRequest(`Invalid feature format. Feature must have a 'feature' name and an array of 'values'.`)
  //     }

  //     const normalizedFeature = feature.toLowerCase()
  //     const normalizedValues = values.map(val => val.trim().toLowerCase())

  //     // If feature exists in category, validate values
  //     if (categoryFeatures[normalizedFeature]) {
  //       const allowedValues = categoryFeatures[normalizedFeature].map(val => val.toLowerCase());
  
  //       if(!allowedCustomValues){
  //         if(!normalizedValues.every(val => allowedValues.includes(val))){
  //           const invalidValues = normalizedValues.filter(val => !allowedValues.includes(val))
  //           throw new httpErrors.BadRequest(`Invalid value(s) for feature '${feature}': ${invalidValues.join(", ")}.`)
  //         }
  //       }
  //       validatedFeatures.push({ feature, values });
  //     } 
  //     else if(allowedCustomValues){
  //       validatedFeatures.push({feature, values})
  //     }
  //     else {
  //       throw new httpErrors.BadRequest(`Feature '${feature}' is not recognized.`);
  //     }
  //   });
  
  //   return validatedFeatures;
  // }
  



  function formatProductFeatures(validatedFeatures){
    return Object.keys(validatedFeatures).map((key) => ({
      feature: key,
      values: validatedFeatures[key] //// values for this feature (e.g., ["Red", "Blue"])
    }))
  }

function uploadFiles(files) {
    if (!Array.isArray(files)) return [];
    return files.map(file => file.path.slice(7));
  } 

async function deleteFileInPublic(fileAddress) {
    if(!fileAddress){
    //   logger.error("No file address provided to deleteFileInPublic")
      throw new httpErrors.BadRequest("no file address provided to deleteFileInPublic ")
    }
    const publicDir = path.join(__dirname, "..", "..", "public")
    const normalizedPath = path.normalize(fileAddress)
    const pathFile = path.join(publicDir, normalizedPath);

    if(!pathFile.startsWith(publicDir)) throw new Error(`Attempted to delete a file outside of public dir: ${pathFile}`)
    
    try {
        await fs.access(pathFile)

        await fs.unlink(pathFile)
    } catch (error) {
        if (error.code !== 'ENOENT') {
            // For other errors, rethrow so caller can handle
            throw error;
          }
    }
   
  }

  async function deleteUploadedFiles(files) {
    if (!Array.isArray(files) || files.length === 0) return;
    try {
      await Promise.all(
        files.map(file => {
          let filePath = null;
          if (typeof file === 'string') {
            filePath = file;
          } else if (file && typeof file.path === 'string') {
            filePath = file.path.slice(7);
          }
          return filePath ? deleteFileInPublic(filePath) : Promise.resolve();
        })
      );
    } catch (error) {
      console.error('File deletion error:', error);
    }
  }



// CATEGORY HELPER FUNCTION_____________________________

async function getAllDescendantCategoryIds(categoryId){
  const categoriesToProcess = [categoryId]
  const allCategoryIds = []

  while(categoriesToProcess.length){
      const currentId = categoriesToProcess.pop()
      allCategoryIds.push(currentId)

      try {
          const childCategories = await CategoryModel.find({parent: currentId}, '_id').lean()
          childCategories.forEach(child => categoriesToProcess.push(child._id))
      } catch (error) {
          throw new httpErrors.InternalServerError(CategoryMSG.failedChildFetch)   
      }
  }
  return allCategoryIds
}

async function deleteCategoryAndChildren(categoryId){
  
      const categoryHierarchy = await getAllDescendantCategoryIds(categoryId)

      try {
          await FeaturesModel.deleteMany({category: {$in: categoryHierarchy}})
      } catch (error) {
          throw new httpErrors.InternalServerError(CategoryMSG.FailedToDeleteFeatures)
      }

      try {
          await CategoryModel.deleteMany({_id: {$in: categoryHierarchy}})
      } catch (error) {
          throw new httpErrors.InternalServerError(CategoryMSG.CategoryDeleteFailed)
      }
}

async function checkCategorySlugUniqueness(slug){
  const categorySlug = await CategoryModel.findOne({slug})
  if (categorySlug) throw new httpErrors.Conflict(CategoryMSG.slugExists)
  return null
}

async function checkExistCategoryById(id){
  const category = await CategoryModel.findById(id);
  if(!category) throw new httpErrors.NotFound(CategoryMSG.CategoryNotFound)
  return category
}


// FEATURES HELPER FUNCTIONS__________

async function checkExistsFeatureByCategoryAndKey(key , category, exceptionId = null){
  const query = {category, key}
  if(exceptionId){
    query._id = { $ne: exceptionId}
  }

  const isExist = await FeaturesModel.findOne(query)
  if(isExist) throw new httpErrors.Conflict(FeaturesMSG.FeatureExist)
}

// CART HELPER FUNCTIONS_________
async function findProductById(productId){
  const {id} = await ObjectIdValidator.validateAsync({id: productId})
  const product = await ProductModel.findById(id)
  if(!product) throw new httpErrors.NotFound(ProductMsg.ProductNotFound)
  return product
}

async function validateCart(cart){
  try {
    if(!cart.items || cart.items.length === 0) return cart
    const productIds = cart.items.map(item => item.productId)

    const products = await ProductModel.find({_id: {$in: productIds}})
    const productMap = new Map(products.map((product) => [product._id.toString(), product]))

    // Identify invalid items
    const invalidItems = []
    for (const item of cart.items) {
      const product = productMap.get(item.productId.toString())
      if(!product || product.count < item.quantity){
        invalidItems.push(item)
      }
    }

    // Remove invalid items from the cart
    
    if(invalidItems.length > 0){
      cart.items = cart.items.filter(
        (item) => !invalidItems.some((invalid) => invalid.productId.equals(item.productId))
      )
      await cart.save()
    }
    return cart
  } catch (error) {
    throw new Error("cart validation failed")
  }

}

async function expireCart(cart, expiresAt){
  try {
    if(!cart) throw new httpErrors.BadRequest("cart is required")
    if(!expiresAt || isNaN(new Date(expiresAt).getTime())){
      throw new Error("invalid expiration date")
    }
    cart.expiresAt = expiresAt
    await cart.save()
  } catch (error) {
    throw new error("failed to set the cart expiration date")
  }
}



module.exports = {
    sendResponse,
    signToken,
    verifyRefreshToken,
    hashingUtils,
    getCategoryFeatures,
    convertFeaturesToObject,
    validateFeatures,
    deleteUploadedFiles,
    uploadFiles,
    setToken,
    getAllDescendantCategoryIds,
    deleteCategoryAndChildren,
    checkCategorySlugUniqueness,
    checkExistCategoryById,
    checkExistsFeatureByCategoryAndKey,
    findProductById,
    validateCart,
    expireCart,
    formatProductFeatures
}