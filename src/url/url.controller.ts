import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { ShortenURLDto } from './dto/shorten-url.dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateURLDto } from './dto/update-url.dto';
import { OptionalJwtAuthGuard } from 'src/auth/jwt.optional.auth.guard';

@Controller('')
@ApiTags('urls')
@ApiBearerAuth('access-token')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('urls/shorten')
  @UseGuards(OptionalJwtAuthGuard)
  async shortenUrl(
    @Body()
    shortenURLDto: ShortenURLDto,
    @Request() req: any,
  ) {
    const userId = req.user.id ? req.user.id : undefined;
    return this.urlService.shortenUrl(shortenURLDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('urls/list')
  async listUserUrls(@Request() req: any) {
    return this.urlService.listUserUrls(req.user.id);
  }

  @Get(':code')
  async redirect(
    @Res() res,
    @Param('code')
    code: string,
  ) {
    const url = await this.urlService.redirect(code);

    console.log(url);

    return res.redirect(url.originalUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Put('urls/:code')
  async updateUrl(
    @Param('code') code: string,
    @Body() updateURLDto: UpdateURLDto,
    @Request() req: any,
  ) {
    return this.urlService.updateUrl(
      code,
      req.user.id,
      updateURLDto.originalUrl,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('urls/:code')
  async deleteUrl(@Param('code') code: string, @Request() req: any) {
    await this.urlService.delete(code, req.user.id);
    return { message: 'URL deleted successfully' };
  }
}
