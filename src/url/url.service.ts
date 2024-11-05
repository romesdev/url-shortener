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
import { User } from 'src/user/user.entity';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async shortenUrl(shortenURLDto: ShortenURLDto) {
    const { originalUrl, userId } = shortenURLDto;

    if (!userId) {
      await this.userRepository.findOneBy({ id: userId });
    }

    const urlCode = nanoid(6);

    try {
      let url = await this.urlRepository.findOneBy({ originalUrl });
      if (url) return url.shortUrl;

      const shortUrl = `${BASE_URL}/${urlCode}`;
      url = this.urlRepository.create({
        urlCode,
        originalUrl,
        shortUrl,
      });

      this.urlRepository.save(url);
      return url.shortUrl;
    } catch (error) {
      throw new UnprocessableEntityException('Server Error');
    }
  }

  async redirect(urlCode: string) {
    try {
      const url = await this.urlRepository.findOneBy({ urlCode });
      if (url) return url;
    } catch (error) {
      throw new NotFoundException('Resource Not Found');
    }
  }
}
