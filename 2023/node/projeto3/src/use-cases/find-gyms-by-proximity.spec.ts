import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { FindGymsByProximityUseCase } from './find-gyms-by-proximity'

let gymsRepository: InMemoryGymsRepository
let sut: FindGymsByProximityUseCase

describe('Find Gyms By Proximity Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FindGymsByProximityUseCase(gymsRepository)
  })

  it('Should find gyms in a range of 5 km', async () => {
    await gymsRepository.create({
      title: 'gym-1',
      latitude: -18.899908,
      longitude: -48.297916,
    })
    await gymsRepository.create({
      title: 'gym-2',
      latitude: -18.719967,
      longitude: -47.492487,
    })

    const { gyms } = await sut.execute({
      latitude: -18.897847,
      longitude: -48.292155,
      distance: 5,
    })

    expect(gyms).toHaveLength(1)
  })
})
