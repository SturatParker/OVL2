import { CommandInteraction } from 'discord.js';
import { Command } from '../../common/core/command.abstract';
import { PollService } from '../../services/database/poll.service';
import { poll } from './poll-command.definition';
import { PollWinnerSubcommand } from './subcommands/poll-winner-subcommand';

export class PollCommand extends Command {
  private pollWinner = new PollWinnerSubcommand(this.pollService);
  constructor(private pollService: PollService) {
    super(poll);
  }

  async execute(interaction: CommandInteraction<'cached'>): Promise<void> {
    const options = interaction.options;
    const subCommandName = options.getSubcommand();
    switch (subCommandName) {
      case 'set':
        return this.set(interaction);
      case 'unset':
        return this.unset(interaction);
      case 'open':
        return this.open(interaction);
      case 'close':
        return this.close(interaction);
      case 'winner':
        return this.pollWinner.execute(interaction);
      case 'random':
        return this.random(interaction);
      case 'shuffle':
        return this.shuffle(interaction);
      default:
        break;
    }
    return;
  }

  public async set(interaction: CommandInteraction): Promise<void> {
    if (!interaction.inGuild())
      return interaction.reply({
        content: 'This command must be performed in a guild',
        ephemeral: true,
      });
    const channel = interaction.options.getChannel('channel', true);
    const maxVotes = interaction.options.getInteger('max_votes', true);
    const maxSelfVotes = interaction.options.getInteger('max_self_votes', true);
    const maxCancels = interaction.options.getInteger('max_cancels', true);

    let poll = await this.pollService.getPoll(channel.id);
    if (poll) {
      return interaction.reply({
        content: `${channel.name} is already a Poll channel`,
        ephemeral: true,
      });
    }
    poll = await this.pollService.createPoll({
      channelId: channel.id,
      guildId: interaction.guildId,
      isOpen: true,
      maxVotes,
      maxSelfVotes,
      maxCancels,
    });
    return interaction.reply({
      content: `Created a new poll for ${channel.name}`,
      ephemeral: true,
    });
  }

  public async unset(interaction: CommandInteraction): Promise<void> {
    const channel = interaction.options.getChannel('channel', true);
    await this.pollService.deletePoll(channel.id);
    return interaction.reply({
      content: `Removed polling from ${channel.name}`,
      ephemeral: true,
    });
  }

  public async open(interaction: CommandInteraction): Promise<void> {
    return this.notYetImplemented(interaction);
  }

  public async close(interaction: CommandInteraction): Promise<void> {
    return this.notYetImplemented(interaction);
  }

  public async random(interaction: CommandInteraction): Promise<void> {
    const channel = interaction.options.getChannel('channel', true);
    const winner = await this.pollService.getRandom(channel.id);
    const content = winner
      ? `${winner.url} with ${winner.voteCount} votes`
      : `No submissions detected in ${channel.name}. Has polling been enabled?`;
    return interaction.reply({
      content,
      ephemeral: true,
    });
  }

  public async shuffle(interaction: CommandInteraction): Promise<void> {
    return this.notYetImplemented(interaction);
  }
}