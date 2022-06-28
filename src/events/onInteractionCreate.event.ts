import { Collection, Interaction } from 'discord.js';
import { Command } from 'src/common/models/command.model';
import { ClientEventHandler } from 'src/common/types/client-event-handler.type';

export class CommandHandler extends ClientEventHandler<'interactionCreate'> {
  private commands_: Collection<string, Command> = new Collection();
  constructor() {
    super(
      'interactionCreate',
      async (interaction: Interaction): Promise<void> => {
        if (!interaction.isCommand()) return;
        await this.getCommand(interaction.commandName)?.execute(interaction);
      }
    );
  }

  public setCommands(...commands: Command[]): this {
    commands.forEach((command) => this.commands_.set(command.name, command));
    return this;
  }

  public getCommand(name: string): Command | undefined {
    return this.commands_.get(name);
  }
}
