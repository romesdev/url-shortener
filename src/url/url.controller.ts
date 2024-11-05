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
import { UserService } from 'src/user/user.service';

@Controller('urls')
export class UrlController {
  constructor(
    private readonly urlService: UrlService,
    private readonly userService: UserService,
  ) {}

  @Post('shorten')
  async shortenUrl(
    @Body()
    shortenURLDto: ShortenURLDto,
  ) {
    return this.urlService.shortenUrl(shortenURLDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('list')
  async listUserUrls(@Request() req) {
    return this.urlService.listUserUrls(req.user.userId);
  }

  @Get('/:code')
  async redirect(
    @Res() res,
    @Param('code')
    code: string,
  ) {
    const url = await this.urlService.redirect(code);

    return res.redirect(url.originalUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateUrl(
    @Param('id') id: number,
    @Body() body: { url: string },
    @Request() req,
  ) {
    return this.urlService.updateUrl(id, req.user.userId, body.url);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteUrl(@Param('id') id: number, @Request() req) {
    await this.urlService.delete(id, req.user.userId);
    return { message: 'URL deleted successfully' };
  }
}
