import { InMemoryCheckinsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'
import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { ValidadeCheckInUseCase } from './validade-check-in'

let checkinRepository: InMemoryCheckinsRepository
let sut: ValidadeCheckInUseCase

describe('Validate Check In Use Case', () => {
  beforeEach(async () => {
    checkinRepository = new InMemoryCheckinsRepository()
    sut = new ValidadeCheckInUseCase(checkinRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Should be able to validate a check in', async () => {
    await checkinRepository.create({
      user_id: 'user1',
      gym_id: 'gym1',
      id: 'RHCP',
    })

    const { checkIn } = await sut.execute({
      checkInId: 'RHCP',
    })

    expect(checkIn).not.toBeNull()
  })

  it('Should NOT be able to validate a invalid check in', async () => {
    await checkinRepository.create({
      user_id: 'user1',
      gym_id: 'gym1',
      id: 'id-01',
    })

    expect(async () => {
      await sut.execute({
        checkInId: 'RHCP',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('Should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

    const createdCheckIn = await checkinRepository.create({
      gym_id: 'gym1',
      user_id: 'user1',
    })
    vi.advanceTimersByTime(1000 * 60 * 21)

    expect(async () => {
      await sut.execute({
        checkInId: createdCheckIn.id,
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
