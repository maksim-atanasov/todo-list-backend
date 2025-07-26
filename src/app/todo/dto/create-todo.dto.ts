import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @Length(3, 50)
  @IsNotEmpty()
  title: string;
}
