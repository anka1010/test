// const hhtp = require("http");
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const Note = require("./models/note");

// morgan.token("body", function getBody(req, res) {
//   return req.body;
// });

const app = express();
app.use(express.static("dist"));

app.use(express.json());
// app.use(morgan(":method :url :status :response-time ms :body"));
app.use(morgan("tiny"));
app.use(cors());

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { "Content-Type": "application/json" });
//   response.end(JSON.stringify(notes));
// });

function generatedId() {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
}

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
  // response.json(notes);
  console.log("Notes...");
  Note.find({}).then((notes) => response.json(notes));
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  Note.findById(request.params.id).then((note) => response.json(note));

  // const note = notes.find((note) => note.id === id);
  // if (note) {
  //   response.json(note);
  // } else {
  //   response.status(404).end();
  // }
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);
  response.status(204).end();
});

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({ error: "content missing" });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  // notes = notes.concat(note);
  // response.json(note);
  note.save().then((savedNote) => {
    response.json(savedNote);
  });
});

function unknownEndpoint(request, response) {
  return response.status(404).send({ error: "Ooops! Something goes wrong :/" });
}

app.use(unknownEndpoint);

const PORT = process.env.PORT;
// app.listen(PORT);
// console.log(`Server running on port ${PORT}`);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
