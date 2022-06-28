import { Client } from 'discord.js';
import { Command } from 'src/common/models/command.model';
import { ClientEventHandler } from 'src/common/types/client-event-handler.type';

export class ReadyHandler extends ClientEventHandler<'ready'> {
  constructor(private commands: Command[]) {
    super('ready');
  }

  execute(client: Client<true>): Promise<void> {
    console.log(`Client ready as ${String(client.user?.tag)}`);
    return new Promise((res) => res());
  }
}
