// const http = require('http')
require('dotenv').config()
const express = require('express')
const cors = require('cors')



const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())



const Note = require('./models/note')


app.get('/', (request, response) => {
  response.send('<h1>Hello World yeah!</h1>')
})

app.get('/api/notes', (request, response) => {
  // response.json(notes)
  Note.find({}).then(notes => {
    response.json(notes)
  }
  )
})

app.get('/api/notes/:id', (request, response, next) => {
  const id = request.params.id
  Note.findById(id).then(note => {
    if (note) {
      response.json(note)
    }
    else {
      response.status(404).end()
    }
  }).catch(error => {
    next(error)
  })
})
// const generateId = () => {
//   const maxId = notes.length > 0
//     ? Math.max(...notes.map(n => n.id))
//     : 0
//   return maxId + 1
// }

app.post('/api/notes', (request, response, next) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  }).catch(error => {
    next(error)
  })
})

app.put('/api/notes/:id', (request, response, next) => {
  const id = request.params.id
  const body = request.body
  const note = {
    content: body.content,
    important: body.important,
  }
  Note.findByIdAndUpdate(id, note, { new: true, runValidators: true, context: 'query' }).then(updatedNote => {
    response.json(updatedNote)
  }).catch(error => {
    next(error)
  })
})




app.delete('/api/notes/:id', (request, response, next) => {
  const id = request.params.id
  Note.findByIdAndRemove(id).then(() => {
    response.status(204).end()
  }).catch(error => {
    next(error)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)






const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
