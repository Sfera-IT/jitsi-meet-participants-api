import { Agent, JID, createClient } from 'stanza';

import { Logger } from '@nestjs/common';

import { TimeoutException } from './exceptions/timeout';

export class JitsiMeet {
  private static readonly logger: Logger = new Logger(this.constructor.name);
  private client: Agent;
  private jid: JID.ParsedJID;

  constructor(
    private credentials,
    private domain,
    private transports,
    private nickname,
  ) {}

  async connect(timeout: number = 3000) {
    return new Promise<void>((resolve, reject) => {
      const failed = setTimeout(() => {
        clearTimeout(failed);
        reject(new TimeoutException('Server connection timeout'));
      }, timeout);

      const jid = this.credentials.jid || 'anon';

      this.client = createClient({
        jid: /\S+@\S+\S+/.test(jid) ? jid : `${jid}@${this.domain}`,
        password: this.credentials.password,
        server: undefined,
        resource: undefined,
        transports: this.transports,
      });

      this.client.on('auth:failed', () => {
        clearTimeout(failed);
        reject(new Error('Failed to authenticate, check provided credentials'));
      });

      this.client.on('auth:success', () => {
        clearTimeout(failed);
      });

      this.client.on('session:started', () => {
        this.jid = JID.parse(this.client.jid);
        resolve();
      });

      try {
        this.client.connect();
      } catch (err) {
        reject(err);
      }
    });
  }

  async participants(room: string, timeout: number = 3000): Promise<string[]> {
    const participants = [];

    return new Promise((resolve, reject) => {
      const failed = setTimeout(
        () => reject(new TimeoutException('No participants available')),
        timeout,
      );

      this.client.on('available', (message) => {
        clearTimeout(failed);
        const data = <any>message.muc;
        const lastParticipant = data.statusCodes.some((item) =>
          ['100', '110'].some((code) => code == item),
        );
        const focus = /\/focus$/.test(message.from);
        if (!lastParticipant && !focus) {
          participants.push(message.nick);
        } else if (focus) {
        } else {
          this.client.leaveRoom(room, this.nickname);
          resolve(participants);
        }
      });

      const roomJid = `${room}@conference.${this.domain}/${this.jid.local}`;
      this.client.sendPresence({
        to: roomJid,
        nick: this.nickname,
        muc: { type: 'join' },
      });
    });
  }

  async disconnect() {
    this.client.disconnect();
  }
}
