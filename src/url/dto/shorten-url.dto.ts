import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class ShortenURLDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @ApiProperty()
  originalUrl: string;
}
