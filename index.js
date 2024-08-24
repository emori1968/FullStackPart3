
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

app.get('/info', (request, response) => {
  response.send('<p>Helsinki Fullstack Course Part3</p>')
})

//fetching all persons from Mongo Atlas database
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)

  })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})


/* Old code were person was declared as an local array

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
