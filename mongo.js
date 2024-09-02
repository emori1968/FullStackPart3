// Module for manual data loading. Not used i the app

const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('Give password as argument')
  process.exit(1)
}

// pass apikey as an argument
const password = process.argv[2]

const url = `mongodb+srv://emori1968:${password}@cluster0.it4ey.mongodb.net/personApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: String,
})

// Error output validation
personSchema.set('validateBeforeSave',true)

const Person = mongoose.model('Person', personSchema)


// Manual data loading
if (process.argv.length==3) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
    process.exit(1)
  })
} else
{
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  
  person.save().then( () => {
    console.log('added', person.name, person.number, 'to phonebook')
    mongoose.connection.close()
  })

}