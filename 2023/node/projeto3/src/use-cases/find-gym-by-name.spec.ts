import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { FindGymByNameUseCase } from './find-gym-by-name'

let gymsRepository: InMemoryGymsRepository
let sut: FindGymByNameUseCase

describe('Find Gym by name Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FindGymByNameUseCase(gymsRepository)
  })

  it('Should be able to find a name by valid name', async () => {
    await gymsRepository.create({
      title: 'gym-01',
      latitude: 0,
      longitude: 0,
    })
    const { gym } = await sut.execute({
      name: 'gym-01',
    })

    expect(gym).toHaveProperty('id')
  })

  it('Should not be able to find a name by invalid name', async () => {
    await gymsRepository.create({
      title: 'gym-01',
      latitude: 0,
      longitude: 0,
    })
    expect(async () => {
      await sut.execute({
        name: 'gym-02',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
