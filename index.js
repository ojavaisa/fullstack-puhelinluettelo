require('dotenv').config(); // get MongoDB URI as an environment variable, required for ./models/person.js 
const { response } = require('express');
const express = require('express');
const morgan = require('morgan');  // middleware for logging site requests
//const cors = require('cors');   // middleware that allows frontend and backend to be from different origins
const Person = require('./models/person');  // handle MongoDB operations in a separate module

const app = express();

//app.use(cors());
app.use(express.static('build'));
app.use(express.json());

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
    Person.find({}).then(people => { // empty find returns all documents
        res.json(people);
    });
});

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
            res.json(person);
        } else {    // if id is not of any document in db (but is formatted correctly), null is returned
            res.status(404).end();
        }
    })
        .catch(error => next(error)); // if id is formatted wrong, the promise is rejected. pass error to error handler middleware

});

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end(); // if document with id removed or not found return same status
        })
        .catch(error => next(error)); // pass errors to handler
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

const unknownEndpoint = (req, res) => { // middleware to handle all unknown addresses (i.e. all addresses not handled above)
    res.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => { // middleware to handle bad requests
    console.log(error.message);

    if (error.name === 'CastError') { // check if error is from id not compatible with MongoDB id's
        return response.status(400).send({ error: 'malformatted id' });
    }

    next(error);    // if error is none of the above cases pass to Express default error handler
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`);
});