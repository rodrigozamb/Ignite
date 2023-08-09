import { CheckinsRepository } from '@/repositories/checkins-repository'
interface IGetUserMetricsUseCaseRequest {
  userId: string
}

interface GetUserMetricsUseCaseResponse {
  amount: number
}

export class GetUserMetricsUseCase {
  constructor(private checkinsRepository: CheckinsRepository) {}

  async execute({
    userId,
  }: IGetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const amount = await this.checkinsRepository.getUserMetrics(userId)

    return {
      amount,
    }
  }
}
