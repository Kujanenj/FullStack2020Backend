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
  response.status(404).send({ error: "unknown endpoint" });
};
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
function getDate() {
  return Date();
}

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});
app.get("/info", (req, res) => {
  Contact.find({}).then((result) => {
    res.send(
      `<p> PhoneBook has info of ${result.length} people</p> <p> ${getDate()}`
    );
  });
});
app.get("/api/persons", (request, response) => {
  Contact.find({}).then((contacts) => {
    response.json(contacts.map((contact) => contact.toJSON()));
  });
});
app.get("/api/persons/:id", (req, res, next) => {
  Contact.findById(req.params.id)
    .then((result) => {
      if (result) {
        return res.json(result);
      } else {
        return res.status(404).json({ error: "Nada" });
      }
    })
    .catch((error) => {
      next(error);
    });
});
app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;
  const contactToUpdate = {
    name: body.name,
    number: body.number,
  };
  Contact.findByIdAndUpdate(req.params.id, contactToUpdate, { new: true })
    .then((updatedContact) => {
      res.json(updatedContact);
    })
    .catch((error) => next(error));
});
app.delete("/api/persons/:id", (request, response, next) => {
  Contact.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});
app.post("/api/persons", (request, response,next) => {
  const body = request.body;
  const newContact = new Contact({
    name: body.name,
    number: body.number,
    date: getDate(),
  });
  newContact.save().then((savedContact) => {
    response.json(savedContact);
  }).catch(error => next(error));
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
const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "Wrong id" });
  }
  if(error.name ==="ValidationError"){
    return res.status(400).json({ error: error.message })
  }
  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//{"_id":{"$oid":"5f3689a31b39550e29e9ad10"},"name":"Insomniaaa","number":"0111","date":{"$date":{"$numberLong":"1597409699000"}},"__v":{"$numberInt":"0"}}
