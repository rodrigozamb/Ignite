import { FastifyInstance } from 'fastify'
import { authenticate } from './controllers/authenticate'
import { createUser } from './controllers/register'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', createUser)
  app.post('/sessions', authenticate)
}
