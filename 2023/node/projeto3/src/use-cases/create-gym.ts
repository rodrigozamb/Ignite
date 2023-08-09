import { GymsRepository } from '@/repositories/gyms-repository'
import { Gym } from '@prisma/client'

interface ICreateGym {
  title: string
  description?: string | null
  latitude: number
  longitude: number
}

interface ICreateGymResponse {
  gym: Gym
}

export class CreateGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    latitude,
    longitude,
    title,
    description,
  }: ICreateGym): Promise<ICreateGymResponse> {
    const gym = await this.gymsRepository.create({
      latitude,
      longitude,
      title,
      description,
    })

    return {
      gym,
    }
  }
}
