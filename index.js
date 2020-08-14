require("dotenv").config();

const express = require("express");
const app = express();
const morgan = require("morgan");
const originalSend = app.response.send;
const originalJson = app.response.json;
const cors = require("cors");
const Contact = require("./models/contact");


app.use(express.static("build"));
app.use(express.json());
app.use(cors());


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
//app.use(unknownEndpoint)

app.response.send = function sendOverWrite(body) {
  originalSend.call(this, body);
  this.__custombody__ = body;
};
app.response.json = function jsonOverride(body) {
  originalJson.call(this, body);
  this.__custombody__ = body;
};
morgan.token("body", (req) => JSON.stringify(req.body));
//morgan.token('responseData',(req,res) => JSON.stringify(res.status))
app.use(
  morgan((tokens, req, res) => {
    return `${tokens.method(req, res)} ${tokens.url(req, res)} ${tokens.body(
      req
    )}`;
  })
);

morgan.token("responseData", (_req, res) => JSON.stringify(res.__custombody__));
function countPersons() {
  return persons.length;
}
function getDate() {
  return Date();
}
const generateId = () => {
  const maxId =
    Contact.find({}).length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};
app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});
app.get("/info", (req, res) => {
  res.send(
    `<p> PhoneBook has info of ${countPersons()} people</p> <p> ${getDate()}`
  );
});
app.get("/api/persons", (request, response) => {
  Contact.find({}).then((contacts) => {
    response.json(contacts.map((contact) => contact.toJSON()));
  });
});
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  console.log(id);
  const person = persons.find((person) => person.id === id);
  console.log(person);
  if (person) {
    return res.json(person);
  } else {
    return res.status(404).json({ error: "Nada" });
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  console.log(id)
  Contact.findByIdAndDelete(id).then((result) => {
    response.status(204).end();
  }).catch(error => {
    console.log(error)
    response.status(500).end()
  })
});
app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name missing or number missing",
    });
  }

  /* if (Contact.find((contact) => contact.name === body.name)) {
    return response.status(400).json({
      error: "Name must be unique",
    });
  }*/

  const newContact = new Contact({
    name: body.name,
    number: body.number,
    date: getDate(),
    id: generateId(),
  });

  newContact.save().then((savedContact) => {
    response.json(savedContact);
  });
});
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, ""),
      "-",
      tokens.responseData(req, res),
      tokens["response-time"](req, res),
      "ms",
    ].join(" ");
  })
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//{"_id":{"$oid":"5f3660b7f0232a299251e718"},"name":"Insomniaa","number":"0111","date":{"$date":{"$numberLong":"1597399223000"}},"id":{"$numberInt":"1"},"__v":{"$numberInt":"0"}}
