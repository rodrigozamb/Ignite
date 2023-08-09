import { GymsRepository } from '@/repositories/gyms-repository'
import { Gym } from '@prisma/client'
interface IFindGymsByProximityUseCaseRequest {
  latitude: number
  longitude: number
  distance: number
}

interface FindGymsByProximityUseCaseResponse {
  gyms: Gym[]
}

export class FindGymsByProximityUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    latitude,
    longitude,
    distance,
  }: IFindGymsByProximityUseCaseRequest): Promise<FindGymsByProximityUseCaseResponse> {
    const gyms = await this.gymsRepository.findGymsByProximity(
      { latitude, longitude },
      distance,
    )

    return {
      gyms,
    }
  }
}
