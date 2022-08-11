import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Command } from 'src/common/core/command.abstract';
import { Submission } from 'src/common/models/submission.model';
import { ColourUtils } from 'src/common/utils/colour.utils';
import { Mention } from 'src/common/utils/mention.utils';
import { Numeric } from 'src/common/utils/numeric.utils';
import { PollService } from 'src/services/database/poll.service';
import { PaginatedListReply } from '../../../common/core/paginated-list-reply';
import { poll } from '../poll-command.definition';

export class PollWinnerSubcommand extends Command {
  constructor(private pollService: PollService) {
    super(poll);
  }

  async execute(interaction: CommandInteraction<'cached'>): Promise<void> {
    const channel = interaction.options.getChannel('channel', true);
    const top_n = interaction.options.getInteger('top_n') ?? 3;

    const [submissions, poll] = await Promise.all([
      this.pollService.getTop(channel.id, top_n),
      this.pollService.getPoll(channel.id),
    ]);

    if (!poll) {
      return this.refuseCommand(
        interaction,
        `Polling is not enabled in ${Mention.channel(channel)}`
      );
    }

    if (!submissions.length) {
      return this.refuseCommand(
        interaction,
        `No votes have been cast in ${Mention.channel(channel)}`
      );
    }

    const items = submissions.map(this.transformSubmissionToResult);
    const embed = new MessageEmbed({
      title: `Poll winners`,
      color: ColourUtils.success,
      timestamp: new Date(),
      description: `A total of ${
        poll.voteCount
      } votes were cast in ${Mention.channel(
        channel
      )} this round. Showing the top ${Math.min(
        items.length,
        top_n
      )} submissions`,
    });
    const reply = new PaginatedListReply(interaction, embed, items, 10);

    await reply.send();
  }

  private transformSubmissionToResult(
    this: void,
    submission: Submission,
    index: number
  ): string {
    const pluralised = submission.voteCount > 1 ? `votes` : `vote`;
    return `${Numeric.toMedal(index + 1)}: ${submission.linkText} with ${
      submission.voteCount
    } ${pluralised}`;
  }
}
