import { Interaction } from 'discord.js';
import { Command } from 'src/common/models/command.model';
import { ClientEventHandler } from 'src/common/types/ClientEventHandler.type';
import { PollCommand } from './../commands/poll/poll.command';
import { PollingService } from './../services/database/pollingService.service';

export class CommandHandler extends ClientEventHandler<'interactionCreate'> {
  commands: Command[];
  poll: Command;
  constructor(private pollService: PollingService) {
    super('interactionCreate', (interaction: Interaction) => {
      if (!interaction.isCommand()) return;
      this.commands
        .find((command) => command.name == interaction.commandName)
        ?.execute(interaction);
    });
    this.poll = new PollCommand(pollService);
    this.commands = [this.poll];
  }
}
