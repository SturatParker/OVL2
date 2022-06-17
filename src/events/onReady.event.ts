import { Client } from 'discord.js';
import { ClientEventCallback } from 'src/common/types/ClientEventCallback.type';
import { ClientEventHandler } from 'src/common/types/ClientEventHandler.type';
import { poll } from '../commands/poll/poll.command';

export const logReady: ClientEventCallback<'ready'> = (client: Client) => {
  const homeGuild = client.guilds.cache.get(process.env.HOME_GUILD_ID);
  const isProduction = process.env.NODE_ENV === 'production';

  const commands = isProduction
    ? client.application.commands
    : homeGuild.commands;

  if (!commands) return;
  [poll].forEach((command) => {
    commands.create(command.data as any);
  });
  console.log(`Client ready as ${client.user.tag}`);
};

export const onReady: ClientEventHandler<'ready'> = new ClientEventHandler(
  'ready',
  logReady
);
