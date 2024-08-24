// Mongo Atlas with mongoose interface
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
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

const Person = mongoose.model('Person', personSchema)

// export only public obeject 'Person'
module.exports = mongoose.model('Person', personSchema)