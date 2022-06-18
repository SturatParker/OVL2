import { Client } from 'discord.js';
import { Command } from 'src/common/models/command.model';
import { ClientEventHandler } from 'src/common/types/ClientEventHandler.type';

export class ReadyHandler extends ClientEventHandler<'ready'> {
  constructor(commands: Command[]) {
    super('ready', (client: Client) => {
      const homeGuild = client.guilds.cache.get(
        process.env.HOME_GUILD_ID ?? ''
      );
      const isProduction = process.env.NODE_ENV === 'production';

      const commandManager = isProduction
        ? client.application?.commands
        : homeGuild?.commands;

      if (!commandManager) return;
      commands.forEach((command) => {
        console.log(`Registering command: ${command.data}`);
        commandManager.create(command.data as any);
      });
      console.log(`Client ready as ${client.user?.tag}`);
    });
  }
}
