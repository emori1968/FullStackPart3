const express = require('express')
const app = express()
app.use(express.json())

// HTTP request logger middleware for node.js 
var morgan = require('morgan')
app.use(morgan('tiny'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Wop! unknown endpoint' })
}

let persons =
[
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/', (request, response) => {
  response.send('<p>Helsinki Fullstack Course Part3</p>')
})

app.get('/info', (request, response) => {
  const d = new Date()
  let date = d.toUTCString()
  const len = String(persons.length)
  //.send recive text
  response.send(`<p>Phonebookhas info for ${len} people</p>${date}`)
  console.log("Sending date:",date)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
  console.log("All list was sended")
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
      //.json can receive an object
      response.json(person)
    } else {
      response.status(404).end()
    }
    // console.log("request.params: ", request.params)
    // console.log("request.body: ", request.body)
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
    console.log("request.params: ", request.params)
    console.log("request.body: ", request.body)
  })

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
