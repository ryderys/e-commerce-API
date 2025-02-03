const { default: mongoose } = require("mongoose")

const ReportSchema = new mongoose.Schema({
    reporter: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    reviewId: {type: mongoose.Schema.Types.ObjectId, ref: "Review", required: true},
    reason: {type: String, enum: ['spam', 'inappropriate', 'false_info', 'other'], required: true},
    description: {type: String, trim: true},
    edited: {type: Boolean, default: false},
    status: {type: String, enum: ['pending', 'resolved'], default: 'pending'},
    action: {type: String, enum: ['remove', 'keep'], required: true},
    resolvedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
}, {
    timestamps: true,
    versionKey: false
})

module.exports = {
    ReportModel: mongoose.model("Report", ReportSchema)
}