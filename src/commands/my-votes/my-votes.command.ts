import { CommandInteraction, EmbedField, MessageEmbed } from 'discord.js';
import { Command } from 'src/common/core/command.abstract';
import { ColourUtils } from 'src/common/utils/colour.utils';
import { PollService } from 'src/services/database/poll.service';
import { SubmissionService } from 'src/services/database/submission.service';
import { myVotes } from './my-votes.definition';
export class MyVotesCommand extends Command {
  constructor(
    private pollService: PollService,
    private submissionService: SubmissionService
  ) {
    super(myVotes);
  }

  async execute(interaction: CommandInteraction<'cached'>): Promise<void> {
    const options = interaction.options;
    const channel = options.getChannel('channel', true);

    const [userVotes, poll] = await Promise.all([
      this.submissionService.getByVoter(
        interaction.user.id,
        interaction.guildId,
        channel.id
      ),
      this.pollService.getPoll(channel.id),
    ]);

    if (!poll)
      return this.refuseCommand(
        interaction,
        `Polling is not enabled in <#${channel.id}>`
      );

    if (!userVotes.length)
      return this.refuseCommand(
        interaction,
        `You have no votes cast in <#${channel.id}>`
      );

    const fields: EmbedField[] = userVotes.map((submission) => ({
      name: submission.album,
      value: `${submission.hyperlink} by ${submission.artist} (${
        submission.year
      }) (${submission.genres.join(', ')})`,
      inline: false,
    }));

    const embed = new MessageEmbed({
      title: 'Your votes',
      color: ColourUtils.success,
      description: `You have voted for ${userVotes.length} item in <#${
        channel.id
      }>. Votes remaining: ${poll.maxVotes - userVotes.length}`,
      fields,
    });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
}
