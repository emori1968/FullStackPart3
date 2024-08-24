
require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())

const cors = require('cors')
app.use(cors())

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


// Permite correr el frontend desde el backend
// dist es el directorio que contiene el frontend minimizado con el "build" de Vite en este caso
app.use(express.static('dist'))

// HTTP request logger middleware for node.js 
var morgan = require('morgan')
app.use(morgan('tiny'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Wop! unknown endpoint' })
}

app.get('/', (request, response) => {
  response.send('<p>Helsinki Fullstack Course Part3</p>')
})

//fetching all persons from Mongo Atlas database
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)

  })
})



/* No implemented for this excersice

app.get('/info', (request, response) => {
  const d = new Date()
  let date = d.toUTCString()
  const len = String(persons.length)
  response.send(`<p>Phonebookhas info for ${len} people</p>${date}`)
  console.log("Sending date:",date)
})



app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
  })


const generateId = () => {
    const randId = Math.floor(Math.random()*1000000)
    return String(randId)
  }
  
app.post('/api/persons', (request, response) => {
    const body = request.body
    if (body.name== "") {
      return response.status(400).json({ 
        error: 'Person name missing' 
      })
    }

    const isDuplicated = persons.find(row => row.name === body.name)
    if (isDuplicated) {
      return response.status(400).json({ 
        error: 'Person name duplicated' 
      })
    } 

    if (body.number== "") {
      return response.status(400).json({ 
        error: 'Person number missing' 
      })
    }

    const person = {
      id: generateId(),
      name: body.name,
      number: body.number,
    }

    persons = persons.concat(person)
    response.json(person)
    console.log(request.body)
})

*/

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
