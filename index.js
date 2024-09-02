
require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())

//necesary to conect to different sources
const cors = require('cors')
app.use(cors())

// Importing Public object (MongoDB)
const Person = require('./models/person')

// Run front end from the root of the page
// dist es el directorio que contiene el frontend minimizado con el "build" de Vite en este caso
app.use(express.static('dist'))

// HTTP request logger middleware for node.js 
var morgan = require('morgan')
app.use(morgan('tiny'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Wop! unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Bad format for id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  }
  next(error)
}

// Mongo method countDocuments
app.get('/info', (request, response) => {
  Person.countDocuments({}).then((count) => { 
    response.send(`<h2>Helsinki FullStack Course.<br/> Datasbase with ${count} documents</h2>`)
  })
})

//fetching all persons from Mongo Atlas database using Mogo find
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)

  })
})

// express.json set body as attribute for data
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'name is missing' })
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save()
    .then(savedPerson => {response.json(savedPerson)})
    .catch(error => next(error))})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


// this has to be the last loaded middleware, also all the routes should be registered before this!

app.use(unknownEndpoint)
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})