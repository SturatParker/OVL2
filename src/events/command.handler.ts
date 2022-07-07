import { CacheType, Collection, Interaction } from 'discord.js';
import { Command } from 'src/common/core/command.abstract';
import { ClientEventHandler } from 'src/common/types/client-event-handler.type';

export class CommandHandler extends ClientEventHandler<'interactionCreate'> {
  private commands: Collection<string, Command> = new Collection();

  constructor() {
    super('interactionCreate');
  }

  async execute(interaction: Interaction<CacheType>): Promise<void> {
    if (!interaction.isCommand()) return;
    await this.getCommand(interaction.commandName)?.execute(interaction);
  }

  public setCommands(...commands: Command[]): this {
    commands.forEach((command) => this.commands.set(command.name, command));
    return this;
  }

  public getCommand(name: string): Command | undefined {
    return this.commands.get(name);
  }
}
