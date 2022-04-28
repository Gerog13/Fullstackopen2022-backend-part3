const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan('tiny'));

let PHONEBOOK = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// morgan.token('host', (req, res) => {
//     return req.hostname;
// })

app.get("/api/persons", (req, res) => {
  res.json(PHONEBOOK);
});

app.get("/info", (req, res) => {
  const today = new Date();
  res.send(`<h3>Phonebook has info for ${PHONEBOOK.length} people</h3>
        <p>${today}</p>
    `);
});

app.get("/api/persons/:id", (req, res) => {
  let personId = Number(req.params.id);
  let person = PHONEBOOK.find((p) => p.id === personId);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  let personId = Number(req.params.id);
  PHONEBOOK = PHONEBOOK.filter((p) => p.id !== personId);
  console.log({PHONEBOOK})
  res.status(204).end();
});

app.post("/api/persons", morgan(':method :url :body'), (req, res) => {
  const body = req.body;
  if (!body.name) return res.status(404).json({ error: "the name is missing" });
  if (!body.number)
    return res.status(404).json({ error: "the number is missing" });
  let personExists =
    PHONEBOOK.filter((p) => p.name === body.name).length > 0 ? true : false;
  if (personExists)
    return res.status(404).json({ error: "name must be unique" });
  const person = {
    id: Math.random() * 10000,
    name: body.name,
    number: body.number,
  };
  PHONEBOOK = PHONEBOOK.concat(person);
  res.json({
    status: res.statusCode,
    message: `${body.name} was added successfully`,
  });
});

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
