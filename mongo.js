require('dotenv').config()
const mongoose = require('mongoose')

// always choose the test database or the production database
// using the NODE_ENV environment variable
// example: process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI
const url = process.env.TEST_MONGODB_URI

console.log('connecting to', url)

mongoose.set('strictQuery', false)
mongoose.connect(url)


const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'Testing makes the app less buggy',
  important: true,
})

note.save().then(
  () => {
    console.log('note saved!')
    mongoose.connection.close()
  }
)
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})