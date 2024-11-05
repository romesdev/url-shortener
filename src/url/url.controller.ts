import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { UrlService } from './url.service';
import { ShortenURLDto } from './dtos/url.dto';

@Controller()
export class UrlController {
  constructor(private service: UrlService) {}

  @Post('shorten')
  shortenUrl(
    @Body()
    shortenURLDto: ShortenURLDto,
  ) {
    return this.service.shortenUrl(shortenURLDto);
  }

  @Get(':code')
  async redirect(
    @Res() res,
    @Param('code')
    code: string,
  ) {
    const url = await this.service.redirect(code);

    return res.redirect(url.originalUrl);
  }
}
