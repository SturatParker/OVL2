import { GuildMember, MessageEmbed, PartialGuildMember } from 'discord.js';
import { Period } from 'src/common/models/period.model';
import { ClientEventHandler } from 'src/common/types/client-event-handler.type';
import { ColourUtils } from 'src/common/utils/ColourUtils';
import { GuildUtils } from 'src/common/utils/GuildUtils';

export class GuildMemberRemoveHandler extends ClientEventHandler<'guildMemberRemove'> {
  constructor() {
    super('guildMemberRemove');
  }
  async execute(member: GuildMember | PartialGuildMember): Promise<void> {
    const iconURL = member.user?.avatarURL() ?? member.user?.defaultAvatarURL;

    const joinedAt = member.joinedAt;
    const now = new Date(Date.now());
    const presentPeriod = joinedAt ? new Period(joinedAt, now) : undefined;

    const embed = new MessageEmbed({
      author: { name: member.user.tag, iconURL },
      title: 'Member Left',
      thumbnail: { url: iconURL },
      fields: [
        {
          name: 'Member since',
          value: joinedAt
            ? joinedAt.toLocaleString('en', {
                dateStyle: 'medium',
              })
            : 'Unknown',
          inline: true,
        },
        {
          name: 'Duration as member',
          value: presentPeriod ? presentPeriod.toString() : 'Unknown',
        },
      ],
      color: ColourUtils.error,
      timestamp: Date.now(),
      footer: { text: `ID: ${member.id}` },
    });

    await GuildUtils.log(member.guild, { embeds: [embed] }).catch((err) =>
      console.error(err)
    );
    return;
  }
}

export const onGuildMemberRemove = new GuildMemberRemoveHandler();
