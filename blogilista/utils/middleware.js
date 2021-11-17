const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const tokenExtractor = (request, response, next) => {
  const tokenString = request.get('authorization')
  if (tokenString) {
    const token = tokenString.substring(7)

    // Verify token. If invalid, token is null
    try {
      request.token = jwt.verify(token, process.env.SECRET)
    } catch (exception) {
      request.token = null
      next(exception)
    }
  }
  next()
}

const userExtractor = async (request, response, next) => {
  // Extract user from token. If token is null, user is null
  const token = request.token
  if (!token) {
    request.user = null
  } else {
    request.user = await User.findById(token.id)
  }
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  }

  next(error)
}

module.exports = {
  requestLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler
}