const jwt = require("jsonwebtoken")
const httpErrors = require("http-errors")
const { AuthMSG } = require("../../modules/auth/auth.msg")
const crypto = require("crypto")
const bcrypt = require("bcrypt")
const path = require("path")
const { FeaturesModel } = require("../../modules/features/features.model")
const CookieNames = require("../constants/cookieEnum")
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

// AUTH HELPER FUNCTIONS

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

// PRODUCT HELPER FUNCTIONS

async function getCategoryFeatures(categoryId){
const features = await FeaturesModel.find({category: categoryId})
if (!features || features.length === 0) {
    throw new httpErrors.NotFound("No features found for the selected category");
  }
return features
}

function convertFeaturesToObject(features) {
    return features.reduce((obj, feature) => {
      obj[feature.key] = feature;
      return obj;
    }, {});
  }

  function validateFeatures(providedFeatures, categoryFeatures) {
    const validatedFeatures = {};
    for (const key in providedFeatures) {
      if (categoryFeatures[key]) {
        validatedFeatures[key] = providedFeatures[key];
      } else {
        throw new httpErrors.BadRequest(`Feature '${key}' is not valid for the selected category`);
      }
    }
    return validatedFeatures;
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
    setToken
}