import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Url } from './url.entity';
import { ShortenURLDto } from './dtos/url.dto';
import { nanoid } from 'nanoid';
import { isURL } from 'class-validator';
import { BASE_URL } from 'src/utils/constants';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private repo: Repository<Url>,
  ) {}

  async shortenUrl(url: ShortenURLDto) {
    const { longUrl } = url;

    if (!isURL(longUrl)) {
      throw new BadRequestException('String Must be a Valid URL');
    }

    const urlCode = nanoid(6);

    try {
      let url = await this.repo.findOneBy({ longUrl });
      if (url) return url.shortUrl;

      const shortUrl = `${BASE_URL}/${urlCode}`;
      url = this.repo.create({
        urlCode,
        longUrl,
        shortUrl,
      });

      this.repo.save(url);
      return url.shortUrl;
    } catch (error) {
      console.log(error);
      throw new UnprocessableEntityException('Server Error');
    }
  }

  async redirect(urlCode: string) {
    try {
      const url = await this.repo.findOneBy({ urlCode });
      if (url) return url;
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Resource Not Found');
    }
  }
}
