import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PuppeteerService } from './puppeteer/puppeteer.service';
import { PuppeteerController } from './puppeteer/puppeteer.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available throughout the application
    }),
  ],
  controllers: [AppController, PuppeteerController],
  providers: [AppService, PuppeteerService],
})
export class AppModule {}
