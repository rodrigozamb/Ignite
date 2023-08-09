import { InMemoryCheckinsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckinUseCase } from './check-in'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

let checkinRepository: InMemoryCheckinsRepository
let gymsRepository: InMemoryGymsRepository
let checkInUseCase: CheckinUseCase

describe('Check In User Use Case', () => {
  beforeEach(async () => {
    checkinRepository = new InMemoryCheckinsRepository()
    gymsRepository = new InMemoryGymsRepository()
    checkInUseCase = new CheckinUseCase(checkinRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym1',
      title: 'a cad',
      description: 'sim',
      phone: '123',
      latitude: -27.0747279,
      longitude: -49.4889672,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Should be able to checkIn', async () => {
    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym1',
      userId: 'user1',
      userLatitude: -27.0747279,
      userLongitude: -49.4889672,
    })

    expect(checkIn).toHaveProperty('id')
  })

  it('Should not be able to checkIn twice in same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 8, 1, 0))

    await checkInUseCase.execute({
      gymId: 'gym1',
      userId: 'user1',
      userLatitude: -27.0747279,
      userLongitude: -49.4889672,
    })

    expect(async () => {
      await checkInUseCase.execute({
        gymId: 'gym1',
        userId: 'user1',
        userLatitude: -27.0747279,
        userLongitude: -49.4889672,
      })
    }).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('Should be able to checkIn twice in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await checkinRepository.create({
      gym_id: 'gym1',
      user_id: 'user1',
    })
    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym1',
      userId: 'user1',
      userLatitude: -27.0747279,
      userLongitude: -49.4889672,
    })

    expect(checkIn).toHaveProperty('id')
  })

  it('Should not be able to checkIn in distant gym', async () => {
    gymsRepository.gyms.push({
      id: 'gym2',
      title: 'a cad2',
      description: 'sim',
      phone: '123',
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672),
    })

    expect(async () => {
      await checkInUseCase.execute({
        gymId: 'gym2',
        userId: 'user1',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      })
    }).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
