const mongoose = require('mongoose');

// usage (for saving a new person to db):
// node mongo.js [password] [name] [number]
// or (to retrieve all people from db):
// node mongo.js [password]

if (process.argv.length < 3) { // password for database user must be given as command line argument
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url =
  `mongodb+srv://fullstackmooc:${password}@cluster0.syvqf.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});
const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 5) { // if there are two arguments after password, save them as name and number
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name: name,
    number: number
  });

  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  });
} else if (process.argv.length === 3) { // if no arguments besides password are given, retrieve all people from database
  Person.find({}).then(persons => {
    console.log('phonebook:');
    persons.forEach(person => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
}
