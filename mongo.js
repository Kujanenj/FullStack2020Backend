const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}
const password = process.argv[2];
const url = `mongodb+srv://jussi:${password}@testcluster.ntx71.mongodb.net/phonebook?retryWrites=true&w=majority`;
const contactSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Contact = mongoose.model("Contact", contactSchema);

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
if (process.argv.length === 3) {
  console.log("Trying to log db")
  Contact.find({}).then(result => {
    result.forEach(contact => {
      console.log(contact)
    })
    mongoose.connection.close()
  })
}
else{
  const nameToAdd = process.argv[3];
  const numberToAdd = process.argv[4];
  
  const contact = new Contact({
    name : nameToAdd,
    number: numberToAdd,
  });
  
  contact.save().then((response) => {
    console.log(nameToAdd, numberToAdd);
    console.log('added'+nameToAdd);
    mongoose.connection.close();
  });
}
  
  