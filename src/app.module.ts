import { Module } from '@nestjs/common';

import { JitsiController } from './jitsi/jitsi.controller';
import { JitsiService } from './jitsi/jitsi.service';

@Module({
  imports: [],
  controllers: [JitsiController],
  providers: [JitsiService],
})
export class AppModule {}
