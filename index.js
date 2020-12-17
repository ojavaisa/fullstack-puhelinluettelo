require('dotenv').config(); // get MongoDB URI as an environment variable, required for ./models/person.js 
const express = require('express');
const morgan = require('morgan');  // middleware for logging site requests
const cors = require('cors');
const Person = require('./models/person');  // handle MongoDB operations in a separate module

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('build'));

morgan.token('content', (req, res) => { // custom token to log request body
    return JSON.stringify(req.body);
});
// use morgan with format that is essentially (predefined format) 'tiny' + custom token from above
// logging is printed to stdout = console log
app.use(
    morgan(
        ':method :url :status :res[content-length] - :response-time ms :content'
    ));

/* app.get('/', (req, res) => { // this is no longer required, handled by frontend
    res.send('<h1>Phonebook</h1>');
}); */

app.get('/info', (req, res) => { // not yet done
    const len = people.length;
    const date = new Date();

    res.send(`<p>Phonebook has info for ${len} people</p>
        <div>${date}</div>`);
});

app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => {
        res.json(people);
    });
});

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(person => {
        res.json(person);
    });
    /* const id = Number(req.params.id);
    const person = people.find(person => person.id === id);

    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    } */
});

app.delete('/api/persons/:id', (req, res) => { // not yet done
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
    } /* else if (people.find(person => person.name === body.name)) {
        //if find returns a person, it already exists and is "truthy", otherwise undefined i.e. false
        return res.status(406).json({
            error: 'name must be unique'
        });
    } */

    const person = new Person({
        name: body.name,
        number: body.number
    });

    person.save().then(savedPerson => {
        res.json(savedPerson);
    });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`);
});