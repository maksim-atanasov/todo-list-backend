import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

export class UpdateTodoDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
  @IsString()
  @Length(3, 50)
  @IsNotEmpty()
  title?: string;
  @IsBoolean()
  @IsNotEmpty()
  completed?: boolean;
}
