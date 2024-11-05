import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
import { ShortenURLDto } from './dto/shorten-url.dto';
import { nanoid } from 'nanoid';
import { isURL } from 'class-validator';
import { BASE_URL } from 'src/utils/constants';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async shortenUrl(shortenURLDto: ShortenURLDto, userId: number) {
    const { originalUrl } = shortenURLDto;

    const urlCode = this.generateShortCode();

    try {
      let user = undefined;
      if (userId) {
        user = await this.userRepository.findOneBy({ id: userId });
      }

      let url = await this.urlRepository.findOneBy({
        originalUrl,
        user: user,
      });

      if (url) return url.shortUrl;

      const shortUrl = `${BASE_URL}/${urlCode}`;
      url = this.urlRepository.create({
        urlCode,
        originalUrl,
        shortUrl,
        user,
      });

      this.urlRepository.save(url);
      return url.shortUrl;
    } catch (error) {
      throw new UnprocessableEntityException('Server Error');
    }
  }

  async findByShortCode(urlCode: string): Promise<Url> {
    const url = await this.urlRepository.findOne({
      where: { urlCode, deletedAt: null },
    });
    if (!url) {
      throw new NotFoundException('URL not found');
    }
    return url;
  }

  async redirect(urlCode: string) {
    try {
      const url = await this.urlRepository.findOneBy({ urlCode });

      if (url) {
        await this.incrementVisits(url);
        return url;
      }
    } catch (error) {
      throw new NotFoundException('Resource Not Found');
    }
  }

  async incrementVisits(url: Url): Promise<Url> {
    url.visits += 1;
    return this.urlRepository.save(url);
  }

  async delete(urlCode: string, userId: number): Promise<void> {
    const url = await this.urlRepository.findOne({
      where: { urlCode, user: { id: userId }, deletedAt: null },
      relations: ['user'],
    });
    if (!url) {
      throw new NotFoundException('URL not found');
    }
    url.deletedAt = new Date();
    await this.urlRepository.save(url);
  }

  private generateShortCode(): string {
    return nanoid(6);
  }

  async listUserUrls(userId: number): Promise<Url[]> {
    return this.urlRepository.find({
      where: { user: { id: userId }, deletedAt: null },
      relations: ['user'],
    });
  }

  async updateUrl(
    urlCode: string,
    userId: number,
    newOriginalUrl: string,
  ): Promise<Url> {
    const url = await this.urlRepository.findOne({
      where: { urlCode, user: { id: userId }, deletedAt: null },
      relations: ['user'],
    });
    if (!url) {
      throw new NotFoundException('URL not found');
    }
    url.originalUrl = newOriginalUrl;
    return this.urlRepository.save(url);
  }
}
