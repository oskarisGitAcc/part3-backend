const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];
const nameToAdd = process.argv[3];
const numberToAdd = process.argv[4];

const url = `mongodb+srv://fullstack:${password}@cluster0.vkrw6kj.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery',false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (nameToAdd && numberToAdd) {

  const person = new Person({
    name: nameToAdd,
    number: numberToAdd
  });

  person.save().then(result => {
    console.log(`added ${nameToAdd} number ${numberToAdd} to phonebook`);
  }).catch(error => {
    console.error('error saving person:', error.message);
  }).finally(() => {
    mongoose.connection.close();
  });

}

if (!nameToAdd && !numberToAdd) {

  Person.find({}).then(result => {
    console.log('phonebook:');
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });
  }).catch(error => {
    console.error('error fetching phonebook:', error.message);
  }).finally(() => {
    mongoose.connection.close();
  });

}
