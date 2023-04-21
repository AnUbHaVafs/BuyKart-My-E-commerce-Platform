const mongoose = require('mpongoose')
exports.validateMongoDBID = (id) => {
    const isValid = mongoose.Schema.Types.ObjectId.isValid(id)
    if (!isValid) throw new Error("This is not valid or not found")
}