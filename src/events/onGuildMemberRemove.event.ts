import { GuildMember, MessageEmbed, PartialGuildMember } from 'discord.js';
import { Period } from 'src/common/models/period.model';
import { ClientEventCallback } from 'src/common/types/ClientEventCallback.type';
import { ClientEventHandler } from 'src/common/types/ClientEventHandler.type';
import { ColourUtils } from 'src/common/utils/ColourUtils';
import { GuildUtils } from 'src/common/utils/GuildUtils';

export const logGuildMemberRemove: ClientEventCallback<'guildMemberRemove'> = (
  guildMember: GuildMember | PartialGuildMember
): void => {
  const iconURL =
    guildMember.user?.avatarURL() ?? guildMember.user?.defaultAvatarURL;

  const joinedAt = guildMember.joinedAt;
  const now = new Date(Date.now());
  const presentPeriod = new Period(joinedAt, now);

  const embed = new MessageEmbed({
    author: { name: guildMember.user.tag, iconURL },
    title: 'Member Left',
    thumbnail: { url: iconURL },
    fields: [
      {
        name: 'Member since',
        value: joinedAt.toLocaleString('en', {
          dateStyle: 'medium',
        }),
        inline: true,
      },
      { name: 'Duration as member', value: presentPeriod.toString() },
    ],
    color: ColourUtils.error,
    timestamp: Date.now(),
    footer: { text: `ID: ${guildMember.id}` },
  });

  GuildUtils.log(guildMember.guild, { embeds: [embed] }).catch((err) =>
    console.error(err)
  );
};

export const onGuildMemberRemove: ClientEventHandler<'guildMemberRemove'> =
  new ClientEventHandler('guildMemberRemove', logGuildMemberRemove);
