import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
import { UrlController } from './url.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Url]), UserModule],
  providers: [UrlService],
  controllers: [UrlController],
})
export class UrlModule {}
