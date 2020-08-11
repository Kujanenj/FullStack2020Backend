const express = require("express");
const app = express();
const morgan = require("morgan")

app.use(express.json())
morgan.token('body',(req) => JSON.stringify(req.body))
app.use(morgan((tokens,req,res)=>{
    return `${tokens.method(req,res)} ${tokens.url(req,res)} ${tokens.body(req)}`
}))

let persons = [
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];
function countPersons() {
  return persons.length;
}
function getDate() {
  return Date();
}
const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }
app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});
app.get("/info", (req, res) => {
  res.send(
    `<p> PhoneBook has info of ${countPersons()} people</p> <p> ${getDate()}`
  );
});
app.get("/api/persons", (req, res) => {
  res.json(persons);
});
app.get("/api/persons/:id",
  (req, res) => {

    const id = Number(req.params.id);
    console.log(id)
    const person = persons.find(person => person.id === id);
    console.log(person)
    if (person) {
    return  res.json(person);
    } else {
        return res.status(404).json({error: "Nada"})
    }
  });

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(note => note.id !== id)
  
    response.status(204).end()
  })
  app.post('/api/persons', (request, response) => {
    const body = request.body
 
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'name missing or number missing' 
      })
    }
    if(persons.find(person => person.name == body.name)){
        return response.status(400).json({
            error:'Name must be unique'
        })
    }
    const newPerson = {
      name: body.name,
      number: body.number,
      date: getDate(),
      id: generateId(),
    }
  
    persons= persons.concat(newPerson)
  
    response.json(newPerson)
  }) 
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
