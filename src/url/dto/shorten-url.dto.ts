import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class ShortenURLDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  originalUrl: string;

  @IsOptional()
  userId?: number;
}
