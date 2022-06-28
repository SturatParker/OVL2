import { GuildMember, MessageEmbed } from 'discord.js';
import { Period } from 'src/common/models/period.model';
import { ClientEventCallback } from 'src/common/types/client-event-callback.type';
import { ClientEventHandler } from '../common/types/client-event-handler.type';
import { ColourUtils } from '../common/utils/ColourUtils';
import { GuildUtils } from './../common/utils/GuildUtils';

export const logGuildMemberAdd: ClientEventCallback<'guildMemberAdd'> = async (
  guildMember: GuildMember
): Promise<void> => {
  const iconURL =
    guildMember.user.avatarURL() ?? guildMember.user.defaultAvatarURL;

  const now = new Date(Date.now());
  const createdAt = guildMember.user.createdAt;
  const age = new Period(now, createdAt);

  const embed = new MessageEmbed({
    author: { name: guildMember.user.tag, iconURL },
    title: 'Member Joined',
    thumbnail: { url: iconURL },
    description: `Account details for <@${guildMember.id}>`,
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
    footer: { text: `ID: ${guildMember.id}` },
  });

  await GuildUtils.log(guildMember.guild, { embeds: [embed] }).catch((err) =>
    console.error(err)
  );
  return;
};

export const onGuildMemberAdd: ClientEventHandler<'guildMemberAdd'> =
  new ClientEventHandler('guildMemberAdd', logGuildMemberAdd);
