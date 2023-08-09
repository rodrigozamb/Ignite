import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { Gym, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import { GymsRepository } from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = []

  async findById(id: string) {
    const gym = this.gyms.find((gym) => gym.id === id)

    if (!gym) {
      return null
    }

    return gym
  }

  async create({
    latitude,
    longitude,
    title,
    description,
    phone,
    id,
  }: Prisma.GymCreateInput) {
    const gym = {
      id: id ?? randomUUID(),
      title,
      description: description ?? null,
      phone: phone ?? null,
      latitude: new Prisma.Decimal(latitude.toString()),
      longitude: new Prisma.Decimal(longitude.toString()),
      created_at: new Date(),
    }

    this.gyms.push(gym)

    return gym
  }

  async findGymByName(name: string) {
    const gym = this.gyms.find((gym) => gym.title === name)

    if (!gym) {
      return null
    }

    return gym
  }

  async findGymsByProximity(
    data: { latitude: number; longitude: number },
    distanceLimit: number,
  ) {
    const gyms = this.gyms.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(data, {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      })

      return distance <= distanceLimit
    })

    return gyms
  }
}
