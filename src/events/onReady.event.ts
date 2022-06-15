import { Client } from 'discord.js';
import { ClientEventCallback } from 'src/common/types/ClientEventCallback.type';
import { ClientEventHandler } from 'src/common/types/ClientEventHandler.type';

export const logReady: ClientEventCallback<'ready'> = (client: Client) => {
  console.log(`Client ready as ${client.user.tag}`);
};

export const onReady: ClientEventHandler<'ready'> = new ClientEventHandler(
  'ready',
  logReady
);
