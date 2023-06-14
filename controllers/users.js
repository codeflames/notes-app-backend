const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/users')

userRouter.post('/', async (request, response) => {
  const { name, username, password } = request.body

  const passwordHash = await bcrypt.hash(password, 10)

  const user = new User({
    name,
    username,
    passwordHash
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)

})

userRouter.get('/', async(request, response) => {
  const users = await User.find({}).populate('notes', { content: 1, important: 1 })
  response.json(users)
})

module.exports = userRouter