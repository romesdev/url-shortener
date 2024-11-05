import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class UpdateURLDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @ApiProperty()
  originalUrl: string;
}
