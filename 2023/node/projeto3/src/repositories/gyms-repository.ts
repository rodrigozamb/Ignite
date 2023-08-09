import { Gym, Prisma } from '@prisma/client'

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>
  create(data: Prisma.GymCreateInput): Promise<Gym>
  findGymByName(name: string): Promise<Gym | null>
  findGymsByProximity(
    from: {
      latitude: number
      longitude: number
    },
    distanceLimit: number,
  ): Promise<Gym[]>
}
