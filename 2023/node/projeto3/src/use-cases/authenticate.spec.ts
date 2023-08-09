import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let authenticateUseCase: AuthenticateUseCase

describe('Authenticate User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    authenticateUseCase = new AuthenticateUseCase(usersRepository)
  })

  it('Should be able to authenticate', async () => {
    await usersRepository.create({
      email: 'rodrigo.zamboni@hotmail.com',
      password_hash: await hash('123456', 6),
      name: 'Rodrigo',
    })

    const { user } = await authenticateUseCase.execute({
      email: 'rodrigo.zamboni@hotmail.com',
      password: '123456',
    })

    expect(user).toHaveProperty('id')
  })

  it('Should not be able to authenticate with invalid email', async () => {
    await usersRepository.create({
      email: 'rodrigo.zamboni@hotmail.com',
      password_hash: await hash('123456', 6),
      name: 'Rodrigo',
    })

    expect(async () => {
      await authenticateUseCase.execute({
        email: 'ricardo.zamboni@hotmail.com',
        password: '123456',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('Should not be able to authenticate with invalid password', async () => {
    await usersRepository.create({
      email: 'rodrigo.zamboni@hotmail.com',
      password_hash: await hash('123456', 6),
      name: 'Rodrigo',
    })

    expect(async () => {
      await authenticateUseCase.execute({
        email: 'rodrigo.zamboni@hotmail.com',
        password: '654321',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
