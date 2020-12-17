const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(result => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message);
    });

// MongoDB doesn't specify what type of documents it stores, this is done in application with mongoose 
const personSchema = new mongoose.Schema({
    name: String,
    number: String
});
// MongoDB stores document id as an object and returns information about mongo version we don't need
// Here we modify returned document object's toJSON method so it returns what we need
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Person', personSchema);