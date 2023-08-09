import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'
import { CreateUserUseCase } from './createUser'
import { UserALreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe('Create User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepository)
  })

  it('Should be able to create a user', async () => {
    const { user } = await createUserUseCase.execute({
      email: 'teste@teste.com',
      name: 'teste name',
      password: 'password123',
    })

    expect(user).toHaveProperty('id')
  })

  it('Should hash user password upon registration', async () => {
    const { user } = await createUserUseCase.execute({
      email: 'teste@teste.com',
      name: 'teste name',
      password: 'password123',
    })

    const isPasswordHashed = await compare('password123', user.password_hash)
    expect(isPasswordHashed).toBe(true)
  })

  it('Should not be able to create 2 users with same email', async () => {
    await createUserUseCase.execute({
      email: 'teste@teste.com',
      name: 'John Doe',
      password: 'password123',
    })

    expect(async () => {
      await createUserUseCase.execute({
        email: 'teste@teste.com',
        name: 'Dany Phanton',
        password: 'password123',
      })
    }).rejects.toBeInstanceOf(UserALreadyExistsError)
  })
})
