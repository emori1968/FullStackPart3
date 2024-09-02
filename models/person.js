// Mongo Atlas with mongoose interface
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to mongodb+srv://emori1968:api_keyxxx@cluster0.it4ey.mongodb.net/personApp?retryWrites=true&w=majority&appName=Cluster0')
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: String,
})

// Borrar _id _v introducido por MongoDB y dejar solo id
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// Create a mongoose model "Person"
const Person = mongoose.model('Person', personSchema)

// export only public object 'Person'
module.exports = mongoose.model('Person', personSchema)