import {
  CommandInteraction,
  EmbedField,
  GuildBasedChannel,
  MessageEmbed,
} from 'discord.js';
import { Command } from 'src/common/models/command.model';
import { ColourUtils } from 'src/common/utils/ColourUtils';
import { SubmissionService } from 'src/services/database/submissionService.service';
import { myvotesDefinition } from './my-votes.definition';
export class MyVotesCommand extends Command<typeof myvotesDefinition> {
  constructor(private submissionService: SubmissionService) {
    super(myvotesDefinition, async (interaction): Promise<void> => {
      if (!interaction.inCachedGuild()) return;
      const options = interaction.options;
      const channel = options.getChannel('channel') ?? undefined;

      const embed = await this.getEmbed(interaction, channel);

      await interaction.reply({ embeds: [embed], ephemeral: true });
    });
  }

  private async getEmbed(
    interaction: CommandInteraction<'cached'>,
    channel?: GuildBasedChannel
  ): Promise<MessageEmbed> {
    const submissions = await this.submissionService.getByVoter(
      interaction.user.id,
      interaction.guildId,
      channel?.id
    );
    const uniqueChannelIds = Array.from(
      new Set(submissions.map((submission) => submission.channelId))
    );
    const fields = uniqueChannelIds.map((channelId): EmbedField => {
      return {
        name: interaction.guild.channels.cache.get(channelId)?.name ?? '',
        value: submissions.map((sub) => sub.linkText).join('\n'),
        inline: false,
      };
    });

    return this.getBaseEmbed().setFields(fields);
  }

  private getBaseEmbed(): MessageEmbed {
    return new MessageEmbed({
      color: ColourUtils.success,
      title: 'Your votes',
    });
  }
}
