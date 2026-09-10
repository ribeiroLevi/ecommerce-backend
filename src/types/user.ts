export interface CreateUserBody {
  name: string;
  email: string;
  address: string;
  adm: boolean;
  login: string;
  password: string;
}

export interface DeleteUserParams {
  id: string;
}

export interface FindUserParams {
  login: string;
}

export interface UpdateUserParams {
  name?: string;
  email?: string;
  address?: string;
  adm?: boolean;
  login?: string;
  password?: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  address: string;
  adm: boolean;
  login: string;
  password: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  address?: string;
  adm?: boolean;
  login?: string;
  password?: string;
}

export interface PatchIdParams {
  id: string;
}
