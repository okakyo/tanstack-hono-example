import type { UserRepository } from "@/features/user/user.repository";
import { editProfileUseCase } from "./usecases/edit-profile.usecase";
import { findUserByIdUseCase } from "./usecases/find-user-by-id.usecase";
import { registerUserUseCase } from "./usecases/register-user.usecase";
import { withdrawUseCase } from "./usecases/withdraw.usecase";

export const userService = (repository: UserRepository) => ({
  findById: findUserByIdUseCase(repository),
  register: registerUserUseCase(repository),
  edit: editProfileUseCase(repository),
  withdraw: withdrawUseCase(repository),
});

export type UserService = ReturnType<typeof userService>;
