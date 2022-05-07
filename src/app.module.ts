import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JitsiController } from './jitsi/jitsi.controller';
import { JitsiService } from './jitsi/jitsi.service';

@Module({
  imports: [],
  controllers: [AppController, JitsiController],
  providers: [AppService, JitsiService],
})
export class AppModule {}
