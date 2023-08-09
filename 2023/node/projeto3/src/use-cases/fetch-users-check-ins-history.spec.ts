import { InMemoryCheckinsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { FetchUserCheckInsHistoryUseCase } from './fetch-users-check-ins-history'

let checkinRepository: InMemoryCheckinsRepository
let sut: FetchUserCheckInsHistoryUseCase

describe('Fetch Users Check Ins  Use Case', () => {
  beforeEach(async () => {
    checkinRepository = new InMemoryCheckinsRepository()
    sut = new FetchUserCheckInsHistoryUseCase(checkinRepository)
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

    const { checkIns } = await sut.execute({
      userId: 'user1',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym1' }),
      expect.objectContaining({ gym_id: 'gym2' }),
    ])
  })

  it('Should be able to fetch paginated user check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkinRepository.create({
        user_id: 'user1',
        gym_id: `gym${i}`,
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'user1',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym21' }),
      expect.objectContaining({ gym_id: 'gym22' }),
    ])
  })
})
