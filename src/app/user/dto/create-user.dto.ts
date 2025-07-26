import { IsNotEmpty, IsString, Length, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  email: string;
  @IsString()
  @Length(8, 25)
  @IsNotEmpty()
  password: string;
}
