import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { UserALreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { makeCreateUserUseCase } from '@/use-cases/factories/make-createUser-use-case'

export async function createUser(req: FastifyRequest, res: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(req.body)

  try {
    const createUserUseCase = makeCreateUserUseCase()
    await createUserUseCase.execute({ name, email, password })
  } catch (err) {
    if (err instanceof UserALreadyExistsError) {
      return res.status(409).send({ message: err.message })
    }

    throw err
  }

  return res.status(201).send()
}
