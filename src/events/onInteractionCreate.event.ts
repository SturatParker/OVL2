import { Interaction } from 'discord.js';
import { Command } from 'src/common/models/command.model';
import { ClientEventHandler } from 'src/common/types/ClientEventHandler.type';
import { PollService } from '../services/database/pollService.service';
import { PollCommand } from './../commands/poll/poll.command';

export class CommandHandler extends ClientEventHandler<'interactionCreate'> {
  commands: Command[];
  poll: PollCommand;
  constructor(private pollService: PollService) {
    super(
      'interactionCreate',
      async (interaction: Interaction): Promise<void> => {
        if (!interaction.isCommand()) return;
        await this.commands
          .find((command) => command.name == interaction.commandName)
          ?.execute(interaction);
      }
    );
    this.poll = new PollCommand(pollService);
    this.commands = [this.poll];
  }
}
