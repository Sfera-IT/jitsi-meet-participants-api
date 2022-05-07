import { Body, Controller, Logger, Post } from '@nestjs/common';

import { ParticipantsDto } from './dto/participants.dto';
import { JitsiService } from './jitsi.service';

@Controller('jitsi')
export class JitsiController {
  private readonly logger: Logger;

  constructor(private readonly jitsiService: JitsiService) {
    this.logger = new Logger(this.constructor.name);
  }
  @Post('participants')
  async participants(@Body() data: ParticipantsDto) {
    return this.jitsiService.participants(
      data.room,
      data.domain,
      data.credentials,
      data.transports,
    );
  }
}
