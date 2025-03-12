const httpError = require("http-errors");
const { UserMsg } = require("./user.msg");
const { sendResponse } = require("../../common/utils/helperFunctions");
const { StatusCodes } = require("http-status-codes");
const { UserModel } = require("./user.model");
const { updateProfileSchema } = require("../../common/validations/user.validation");


class UserController{
    // async getUserProfile(req, res, next){
    //     try {
    //         const user = await UserModel.findById(req.user._id).populate('roles')
    //         if(!user) throw new httpError.NotFound(UserMsg.UserNFound)
    //         return sendResponse(res, StatusCodes.OK, null, {user})
    //     } catch (error) {
    //         next(error)
    //     }
    // }
     async getProfile(req, res, next){
        try {
            const user = await UserModel.findById(req.user._id)
                .select('-hashedRefreshToken -otp -lastOtpRequest -__v')
                .populate({
                    path: 'roles',
                    select: 'role -_id', // Only show role name
                    transform: doc => doc ? doc.role : null
                })
                .populate({
                    path: 'directPermissions',
                    select: 'resource action scope -_id'
                })
                .lean()
                .transform(doc => ({
                    ...doc,
                    roles: [...new Set(doc.roles)], // Remove duplicates
                    mobile: doc.verifiedMobile ? doc.mobile : undefined
                }));
    
            if (!user) {
                throw new createHttpError.NotFound('User not found');
            }
    
            // Custom response shape
            const profileResponse = {
                id: user._id,
                mobile: user.mobile,
                verifiedMobile: user.verifiedMobile,
                email: user.email,
                fullName: user.fullName,
                username: user.username,
                roles: user.roles,
                permissions: user.directPermissions,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };
    
            return sendResponse(res, StatusCodes.OK, 'Profile retrieved', {
                user: profileResponse
            });
    
        } catch (error) {
            next(error);
        }
    };

    async updateUserProfile(req, res, next) {
        try {
            const {error, value} = updateProfileSchema.validate(req.body) 
            if(error) throw new httpError.BadRequest(error.message)

            const { fullName, username, email } = value;
            const userId = req.user._id;
            const updates = Object.keys(req.body);
            const allowedUpdates = ['fullName', 'username', 'email'];
    
            // Validate the updates
            const isValidUpdate = updates.every(update => allowedUpdates.includes(update));
            if (!isValidUpdate) throw new httpError.BadRequest(UserMsg.InvalidUpdate);
    
            // Check for existing conflicts in username and email
            const conflictChecks = [];
    
            if (username) {
                conflictChecks.push(
                    UserModel.findOne({ username: username.toLowerCase().trim(), _id: { $ne: userId } })
                );
            }
    
            if (email) {
                conflictChecks.push(
                    UserModel.findOne({ email: email.toLowerCase().trim(), _id: { $ne: userId } })
                );
            }
    
            const existingUsers = await Promise.all(conflictChecks);
            const conflicts = existingUsers.filter(user => user !== null);
    
            if (conflicts.length > 0) {
                const conflictMessages = conflicts.reduce((acc, user) => {
                    if (user.username === username) acc.username = UserMsg.UsernameExists;
                    if (user.email === email) acc.email = UserMsg.EmailExists;
                    return acc;
                }, {});
    
                const messages = Object.values(conflictMessages).join(', ');
                throw new httpError.Conflict(messages);
            }
    
            // Prepare the update data
            const updateData = {};
            if (fullName) updateData.fullName = fullName;
            if (username) updateData.username = username.toLowerCase().trim();
            if (email) updateData.email = email.toLowerCase().trim();
    
            // Perform the update
            const updatedUser = await UserModel.findByIdAndUpdate(
                userId,
                { $set: updateData },
                {
                    new: true,
                    projection: {
                        hashedRefreshToken: 0,
                        otp: 0,
                        lastOtpRequest: 0,
                        roles: 0,
                        directPermissions: 0,
                    }
                }
            );

    
            if (!updatedUser) throw new httpError.NotFound(UserMsg.UserNFound);
            return sendResponse(res, StatusCodes.OK, UserMsg.ProfileUpdated, { user: updatedUser });
    
        } catch (error) {
            next(error);
        }
    }

    
    async getAllUsers(req, res, next){
        try {
            const { page = 1, limit = 10} = req.query

            const users = await UserModel.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('roles', 'name')

            return sendResponse(res, StatusCodes.OK, null, {users})
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {
    UserController: new UserController()
}