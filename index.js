const express = require('express');
var morgan = require('morgan');  //middleware for logging site requests
const app = express();

app.use(express.json());

morgan.token('content', (req, res) => { //custom token to log request body
    return JSON.stringify(req.body);
});
//use morgan with format that is essentially (predefined format) 'tiny' + custom token from above
//logging is printed to stdout = console log
app.use(
    morgan(
        ':method :url :status :res[content-length] - :response-time ms :content'
    ));

let people = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
];

app.get('/', (req, res) => {
    res.send('<h1>Puhelinluettelo</h1>');
});

app.get('/info', (req, res) => {
    const len = people.length;
    const date = new Date();

    res.send(`<p>Phonebook has info for ${len} people</p>
        <div>${date}</div>`);
});

app.get('/api/persons', (req, res) => {
    res.json(people);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = people.find(person => person.id === id);

    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    people = people.filter(person => person.id !== id);

    res.status(204).end();
});

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'info missing'
        });
    } else if (people.find(person => person.name === body.name)) {
        //if find returns a person, it already exists and is "truthy", otherwise undefined i.e. false
        return res.status(406).json({
            error: 'name must be unique'
        });
    }

    //const id = Math.floor(Math.random() * 9999999);
    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 9999999)
    };

    //console.log(person);
    people = people.concat(person);

    res.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`);
});