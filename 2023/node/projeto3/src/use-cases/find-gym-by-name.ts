import { GymsRepository } from '@/repositories/gyms-repository'
import { Gym } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
interface IFindGymByNameUseCaseRequest {
  name: string
}

interface FindGymByNameUseCaseResponse {
  gym: Gym
}

export class FindGymByNameUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    name,
  }: IFindGymByNameUseCaseRequest): Promise<FindGymByNameUseCaseResponse> {
    const gym = await this.gymsRepository.findGymByName(name)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    return {
      gym,
    }
  }
}
