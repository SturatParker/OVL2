import { Client } from 'discord.js';
import { ClientEventHandler } from '../common/types/client-event-handler.type';

export class ReadyHandler extends ClientEventHandler<'ready'> {
  constructor() {
    super('ready');
  }

  execute(client: Client<true>): Promise<void> {
    console.log(`Client ready as ${String(client.user?.tag)}`);
    return new Promise((res) => res());
  }
}

export const onReady = new ReadyHandler();
