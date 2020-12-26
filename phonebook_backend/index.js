
const { request, response } = require('express')

//Using mongoose to connect with MongoDb and work with models
const mongoose = require('mongoose')

//Using dotenv package to store environment variables
require('dotenv').config()
const Entry = require('./models/entry')

//using Express
const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('build'))

const morgan = require('morgan')    //Morgan middleware
app.use(morgan('tiny'))

const cors = require('cors')      //Cors middleware, so that we can connect files on two different ports cross something...
app.use(cors())


let persons = [
    { id: 1,
      name: 'Arto Hellas', 
      number: '040-123456' 
    },
    { id: 2,
      name: 'Ada Lovelace',
      number: '39-44-5323523' 
    },
    { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
    { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' },
    { id: 5, name: 'Divakar', number: '8912561'}
]

app.get('/api/persons', (request, response)=>{
  Entry.find({}).then(result => {
    response.json(result)
    console.log(result)
  })
})

app.get('/info', (request, response)=>{
    const message = `<p>Phonebook has info for ${persons.length} people</p>
                     <p>${new Date()}</p>`
    response.send(message)
})

app.get('/api/persons/:id', (request, response)=>{
  const id = Number(request.params.id)
  const person = persons.find(person=> person.id===id)
  if(person){
    response.json(person)
  }
  else{
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, reponse)=>{
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id!==id)

  reponse.status(204).end()
})

const generateId = () =>{
  const maxId = persons.length > 0 ? Math.max(...persons.map(n=>n.id)) : 0
  return maxId+1
}

app.post('/api/persons', (request, response)=>{
  const body = request.body

  if(persons.map(person=>person.name).includes(body.name)){
    return response.status(402).json({error: "name already exists"})
  }

  if(!body.name || !body.number){
    return response.status(400).json({error: "name or number missing"})
  }
  
  const person = new Entry({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson) 
    console.log(savedPerson) 
  })
  
})

const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`)
})