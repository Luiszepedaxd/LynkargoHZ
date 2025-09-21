import { User, RegisterFormData, ApiResponse, PaginationParams, ApiListResponse } from '@/types'
import { UserProvider } from '@/lib/providers/user.provider'
import { CreateUserData, UpdateUserData } from '@/lib/repositories/user.repository'

export class UserService {
  constructor(private userProvider: UserProvider) {}

  async findById(id: string): Promise<ApiResponse<User>> {
    return this.userProvider.findById(id)
  }

  async findAll(params?: PaginationParams): Promise<ApiResponse<ApiListResponse<User>>> {
    return this.userProvider.findAll(params)
  }

  async create(data: CreateUserData): Promise<ApiResponse<User>> {
    return this.userProvider.create(data)
  }

  async update(id: string, data: UpdateUserData): Promise<ApiResponse<User>> {
    return this.userProvider.update(id, data)
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return this.userProvider.delete(id)
  }

  async searchByEmail(email: string): Promise<ApiResponse<User[]>> {
    return this.userProvider.findByEmail(email)
  }

  async getUsersByType(tipo: string): Promise<ApiResponse<User[]>> {
    return this.userProvider.findByType(tipo)
  }
}

export function createUserService(userProvider: UserProvider): UserService {
  return new UserService(userProvider)
}
