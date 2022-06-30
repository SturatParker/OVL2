import { CacheType, CommandInteraction } from 'discord.js';
import { Command } from '../../common/models/command.model';
import { PollService } from '../../services/database/poll.service';
import { poll } from './poll.definition';

export class PollCommand extends Command {
  constructor(private pollService: PollService) {
    super(poll);
  }

  async execute(interaction: CommandInteraction<CacheType>): Promise<void> {
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
        return this.winner(interaction);
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

  public async winner(interaction: CommandInteraction): Promise<void> {
    const channel = interaction.options.getChannel('channel', true);
    const top_n = interaction.options.getInteger('top_n');
    let content: string;
    if (top_n) {
      const top = await this.pollService.getTop(channel.id, top_n);
      content = !top.length
        ? `No votes have been cast in <#${channel.id}>`
        : top
            .map(
              (submission, index) =>
                `${index}: ${submission.linkText} with ${submission.voteCount} votes`
            )
            .join('\n');
    } else {
      const winner = await this.pollService.getWinner(channel.id);
      content = !winner
        ? `No votes have been cast in <#${channel.id}>`
        : `${winner.linkText} with ${winner.voteCount} votes`;
    }
    return interaction.reply({
      content,
    });
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
