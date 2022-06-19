import { CommandInteraction } from 'discord.js';
import { Command } from '../../common/models/command.model';
import { PollService } from '../../services/database/pollService.service';
import { pollDefinition } from './poll.definition';

export class PollCommand extends Command<typeof pollDefinition> {
  constructor(private pollService: PollService) {
    super(pollDefinition, async (interaction) => {
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
          return;
      }
    });
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
    return Command.notYetImplemented(interaction);
  }

  public async close(interaction: CommandInteraction): Promise<void> {
    return Command.notYetImplemented(interaction);
  }

  public async winner(interaction: CommandInteraction): Promise<void> {
    const channel = interaction.options.getChannel('channel', true);
    const winner = await this.pollService.getWinner(channel.id);
    const content = winner
      ? `${winner.url} with ${winner.voteCount} votes`
      : `No votes have been cast in ${channel.name}`;
    return interaction.reply({
      content,
      ephemeral: true,
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
    return Command.notYetImplemented(interaction);
  }
}
