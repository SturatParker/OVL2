import { ApplicationCommandData, Client } from 'discord.js';
import { Command } from 'src/common/models/command.model';
import { ClientEventHandler } from 'src/common/types/ClientEventHandler.type';

export class ReadyHandler extends ClientEventHandler<'ready'> {
  constructor(private commands: Command[]) {
    super('ready', async (client: Client) => {
      await this.createCommands(client);
      console.log(`Client ready as ${String(client.user?.tag)}`);
    });
  }

  private async createCommands(client: Client): Promise<void> {
    const homeGuild = client.guilds.cache.get(process.env.HOME_GUILD_ID ?? '');
    const isProduction = process.env.NODE_ENV === 'production';

    const commandManager = isProduction
      ? client.application?.commands
      : homeGuild?.commands;

    if (!commandManager) return;

    const applicationCommands = await Promise.all(
      this.commands.map((command) =>
        commandManager.create(command.data as unknown as ApplicationCommandData)
      )
    );
    console.log('Registered commands:');
    console.group();
    applicationCommands.forEach((command) => console.log(command.name));
    console.groupEnd();
  }
}
