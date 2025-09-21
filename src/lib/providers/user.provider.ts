import { User, ApiResponse, PaginationParams, ApiListResponse } from '@/types'
import { UserRepositoryInterface, CreateUserData, UpdateUserData } from '@/lib/repositories/user.repository'

export interface UserProvider {
  findById(id: string): Promise<ApiResponse<User>>
  findAll(params?: PaginationParams): Promise<ApiResponse<ApiListResponse<User>>>
  create(data: CreateUserData): Promise<ApiResponse<User>>
  update(id: string, data: UpdateUserData): Promise<ApiResponse<User>>
  delete(id: string): Promise<ApiResponse<void>>
  findByEmail(email: string): Promise<ApiResponse<User[]>>
  findByType(tipo: string): Promise<ApiResponse<User[]>>
}

export class UserProviderService implements UserProvider {
  constructor(private userRepository: UserRepositoryInterface) {}

  async findById(id: string): Promise<ApiResponse<User>> {
    return this.userRepository.findById(id)
  }

  async findAll(params?: PaginationParams): Promise<ApiResponse<ApiListResponse<User>>> {
    return this.userRepository.findAll(params)
  }

  async create(data: CreateUserData): Promise<ApiResponse<User>> {
    return this.userRepository.create(data)
  }

  async update(id: string, data: UpdateUserData): Promise<ApiResponse<User>> {
    return this.userRepository.update(id, data)
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return this.userRepository.delete(id)
  }

  async findByEmail(email: string): Promise<ApiResponse<User[]>> {
    return this.userRepository.findByEmail(email)
  }

  async findByType(tipo: string): Promise<ApiResponse<User[]>> {
    return this.userRepository.findByType(tipo)
  }
}
