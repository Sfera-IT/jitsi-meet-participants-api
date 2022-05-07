import { TimeoutError } from 'rxjs';

import { Injectable, Logger } from '@nestjs/common';

import { Credentials, Transports } from './dto/participants.dto';
import { TimeoutException } from './exceptions/timeout';
import { JitsiMeet } from './jitsi-meet';

@Injectable()
export class JitsiService {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(this.constructor.name);
  }

  async participants(
    room: string,
    domain: string,
    credentials: Credentials = { username: 'anon' },
    transports: Transports,
  ): Promise<string[]> {
    const client = new JitsiMeet(
      credentials,
      domain,
      { bosh: undefined, websocket: undefined, ...transports },
      'Bot',
    );
    await client.connect();
    try {
      return await client.participants(room);
    } catch (err) {
      if (err instanceof TimeoutException) return [];

      this.logger.debug(err, err.stack);
    } finally {
      await client.disconnect();
    }
  }
}
