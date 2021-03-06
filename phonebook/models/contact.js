const mongoose = require("mongoose")
mongoose.set("useFindAndModify", false)
mongoose.set("useCreateIndex", true)
const uniqValidator = require("mongoose-unique-validator")
const url = process.env.MONGODB_URI

console.log("connecting to", url)
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connected to MongoDB")
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message)
  })
const contactSchema = new mongoose.Schema({
  name: { type: String, required : true, unique : true, minlength: 3 },
  number: { type: String, required : true, unique : true, minlength: 8 },
  date: Date
})
contactSchema.plugin(uniqValidator)

contactSchema.set("toJSON",{
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("Contact",contactSchema)
