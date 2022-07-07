import { CommandInteraction, EmbedFieldData, MessageEmbed } from 'discord.js';
import { Submission } from 'src/common/models/submission.model';
import { ColourUtils } from 'src/common/utils/colour.utils';
import { Mention } from 'src/common/utils/mention.utils';
import { Command } from '../../common/core/command.abstract';
import { FieldPaginatorRow } from '../../common/core/field-paginator-row';
import { PollService } from '../../services/database/poll.service';
import { poll } from './poll.definition';

export class PollCommand extends Command {
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

  public async winner(
    interaction: CommandInteraction<'cached'>
  ): Promise<void> {
    const channel = interaction.options.getChannel('channel', true);
    const top_n = interaction.options.getInteger('top_n');

    const submissions: Submission[] = await this.pollService.getTop(
      channel.id,
      top_n ?? 1
    );

    if (!submissions.length) {
      return this.refuseCommand(
        interaction,
        `No votes have been cast in ${Mention.channel(channel)}`
      );
    }

    const allFields: EmbedFieldData[] = submissions.map((submission, index) => {
      return {
        name: String(index),
        value: `${index + 1}: ${submission.linkText} with ${
          submission.voteCount
        } votes`,
      };
    });

    const paginator = new FieldPaginatorRow(allFields);

    const embed = new MessageEmbed({
      title: 'Poll winners',
      color: ColourUtils.success,
      timestamp: new Date(),
      description: `Poll data for ${Mention.channel(channel)}`,
      fields: paginator.currentFields(),
    });

    if (!paginator.canNext) {
      return interaction.reply({
        embeds: [embed],
      });
    }

    const reply = await interaction.reply({
      embeds: [embed],
      components: [paginator],
      fetchReply: true,
    });

    paginator.collect(interaction, reply);
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
