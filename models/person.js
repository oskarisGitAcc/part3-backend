const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

mongoose.connect(url).then(result => {
  console.log('connected to MongoDB');
}).catch((error) => {
  console.log('error connecting to mongoDB: ', error.message);
});

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3
  },
  number: {
    type: String,
    required: true,
    minLength: [9, 'Phone number must be at least 8 characters long'],
    validate: {
      validator: function(value) {
        const phoneNumberForm = /\d{2,3}-\d{5,}/;
        return phoneNumberForm.test(value);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Person', personSchema);