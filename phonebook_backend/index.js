
const { request, response } = require('express')

const express = require('express')
const app = express()
app.use(express.json())

const morgan = require('morgan')
app.use(morgan('tiny'))

const cors = require('cors')
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
    response.json(persons)
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
  
  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)
  
  response.json(person)
})
const PORT = 3002
app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`)
})