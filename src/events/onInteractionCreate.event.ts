import { Interaction } from 'discord.js';
import { Command } from 'src/common/models/command.model';
import { ClientEventHandler } from 'src/common/types/ClientEventHandler.type';

export class CommandHandler extends ClientEventHandler<'interactionCreate'> {
  constructor(public commands: Command[]) {
    super(
      'interactionCreate',
      async (interaction: Interaction): Promise<void> => {
        if (!interaction.isCommand()) return;
        await this.commands
          .find((command) => command.name == interaction.commandName)
          ?.execute(interaction);
      }
    );
  }
}
