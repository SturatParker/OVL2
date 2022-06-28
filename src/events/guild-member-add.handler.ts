import { GuildMember, MessageEmbed } from 'discord.js';
import { Period } from 'src/common/models/period.model';
import { ClientEventHandler } from '../common/types/client-event-handler.type';
import { ColourUtils } from '../common/utils/ColourUtils';
import { GuildUtils } from '../common/utils/GuildUtils';

export class GuildMemberAddHandler extends ClientEventHandler<'guildMemberAdd'> {
  constructor() {
    super('guildMemberAdd');
  }

  async execute(member: GuildMember): Promise<void> {
    const iconURL = member.user.avatarURL() ?? member.user.defaultAvatarURL;

    const now = new Date(Date.now());
    const createdAt = member.user.createdAt;
    const age = new Period(now, createdAt);

    const embed = new MessageEmbed({
      author: { name: member.user.tag, iconURL },
      title: 'Member Joined',
      thumbnail: { url: iconURL },
      description: `Account details for <@${member.id}>`,
      fields: [
        {
          name: 'Created',
          value: createdAt.toLocaleString('en', {
            dateStyle: 'medium',
          }),
          inline: true,
        },
        { name: 'Age', value: age.toString() },
      ],
      color: ColourUtils.success,
      timestamp: now,
      footer: { text: `ID: ${member.id}` },
    });

    await GuildUtils.log(member.guild, { embeds: [embed] }).catch((err) =>
      console.error(err)
    );
    return;
  }
}

export const onGuildMemberAdd = new GuildMemberAddHandler();
