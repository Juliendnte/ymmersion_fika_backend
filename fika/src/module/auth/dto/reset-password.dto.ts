import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  resetToken: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
    message: 'Password must have at least 8 characters long.',
  })
  @MaxLength(255, {
    message: 'Password must not contain more than 255 characters.',
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?/§:&-])[A-Za-z\d@$!%*?/§:&-]{8,}$/,
    {
      message: 'Password incorrect.',
    },
  )
  password: string;
}
