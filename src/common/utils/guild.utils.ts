import { Guild, Message, MessageOptions, MessagePayload } from 'discord.js';

export class GuildUtils {
  static log(
    guild: Guild,
    options: string | MessagePayload | MessageOptions
  ): Promise<Message> {
    const logChannel = guild.channels.cache.find(
      (channel) =>
        channel.name.toLocaleLowerCase() == 'log' &&
        channel.type == 'GUILD_TEXT'
    );
    if (logChannel?.type != 'GUILD_TEXT')
      return new Promise((resolve, reject) => {
        reject(`Unable to find log channel in guild ${guild.name}`);
      });
    return logChannel.send(options);
  }
}
