import { User } from "src/entities/user.entity";

export class AccessTokenDto {
  access_token: string;
  userId: string;
  characterId?: string | null;
}

export class LoginUserDto {
  username: string;
  password: string;
}

export class RegisterUserDto {
  username: string;
  message: string;
  user: User;
}
