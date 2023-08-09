import { InMemoryCheckinsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { GetUserMetricsUseCase } from './get-user-metrics'

let checkinRepository: InMemoryCheckinsRepository
let sut: GetUserMetricsUseCase

describe('Get Users Metrics Use Case', () => {
  beforeEach(async () => {
    checkinRepository = new InMemoryCheckinsRepository()
    sut = new GetUserMetricsUseCase(checkinRepository)
  })

  it('Should be able to fetch check-in history', async () => {
    await checkinRepository.create({
      user_id: 'user1',
      gym_id: 'gym1',
    })
    await checkinRepository.create({
      user_id: 'user1',
      gym_id: 'gym2',
    })

    const { amount } = await sut.execute({
      userId: 'user1',
    })

    expect(amount).toEqual(2)
  })
})
