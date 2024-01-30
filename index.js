require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const Person = require('./models/person')

morgan.token('postData', (req) => {
  return JSON.stringify(req.body);
});

app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'));
app.use(express.json());
app.use(express.static('dist'));

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
];

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  });
});

app.get('/info', (request, response) => {
  const requestTime = new Date();
  const numberOfEntries = persons.length;
  const infoResponse = `<p>Phonebook has info for ${numberOfEntries} people</p>
                       <p>${requestTime}</p>`;

  res.send(infoResponse);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
});

function generateUniqueId() {
  return Math.floor(Math.random() * 1000000);
};

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing',
    });
  }

  const duplicateName = persons.find(person => person.name === body.name);

  if (duplicateName) {
    return response.status(400).json({
      error: 'name must be unique',
    });
  }

  const person = {
    id: generateUniqueId(),
    name: body.name,
    number: body.number
  };

  persons = persons.concat(person);

  response.json(person);
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);

  response.status(204).end();
});

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});