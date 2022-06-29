import {
  CacheType,
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu,
  MessageSelectOptionData,
} from 'discord.js';
import { Command } from 'src/common/models/command.model';
import { PollService } from 'src/services/database/poll.service';
import { SubmissionService } from '../../services/database/submission.service';
import { ColourUtils } from './../../common/utils/ColourUtils';
import { UserService } from './../../services/database/user.service';
import { cancelVote } from './cancel-vote.definition';

export class CancelVoteCommand extends Command {
  constructor(
    private userService: UserService,
    private pollService: PollService,
    private submissionService: SubmissionService
  ) {
    super(cancelVote);
  }
  async execute(interaction: CommandInteraction<CacheType>): Promise<void> {
    const channel = interaction.options.getChannel('channel', true);

    const [user, userVotes, poll] = await Promise.all([
      this.userService.getUser(interaction.user.id),
      this.submissionService.getByVoter(interaction.user.id, channel.id),
      this.pollService.getPoll(channel.id),
    ]);

    if (!poll)
      return interaction.reply({
        content: 'That is not a poll channel',
        ephemeral: true,
      });
    const max_values =
      poll.maxCancels -
      (user.cancellations.find((counter) => counter.pollId)?.count ?? 0);

    if (max_values <= 0)
      return interaction.reply({
        content: 'You are out of cancellations in this round',
        ephemeral: true,
      });

    if (!userVotes.length)
      return interaction.reply({
        content: 'You have not voted for anything yet!',
        ephemeral: true,
      });

    const options: MessageSelectOptionData[] = userVotes.map((submission) => ({
      label: submission.album,
      description: `by ${submission.artist}`,
      value: submission.messageId,
    }));

    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu({
        custom_id: 'select',
        min_values: 1,
        max_values,
        options,
        placeholder: 'Nothing selected',
      })
    );
    const embed = new MessageEmbed({
      title: 'Cancel Vote',
      color: ColourUtils.success,
      timestamp: new Date(),
    });

    const message = (await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true,
      fetchReply: true,
    })) as Message<true>;

    const collector = message.createMessageComponentCollector({
      componentType: 'SELECT_MENU',
      time: 60000,
    });

    collector.on('collect', async (collected) => {
      await Promise.all([
        interaction.editReply({ embeds: [embed], components: [] }),
        this.userService.cancelVote(
          user.userId,
          channel.id,
          collected.values.length
        ),
        ...collected.values.map((value) =>
          this.submissionService.cancelVote(value, user.userId)
        ),
      ]);
      return collected.reply({ content: 'All done!', ephemeral: true });
    });

    collector.on('end', async (collected) => {
      await interaction.editReply({ embeds: [embed], components: [] });
    });

    collector.on('dispose', async () => {
      await interaction.editReply({ embeds: [embed], components: [] });
    });
  }
}
