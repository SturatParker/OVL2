import {
  ChannelMention,
  ChannelResolvable,
  Message,
  RoleMention,
  RoleResolvable,
  UserMention,
  UserResolvable,
} from 'discord.js';

export class Mention {
  static channel(channel: ChannelResolvable): ChannelMention {
    const id = typeof channel === 'string' ? channel : channel.id;
    return `<#${id}>`;
  }

  static user(user: Exclude<UserResolvable, Message<boolean>>): UserMention {
    const id = typeof user === 'string' ? user : user.id;
    return `<@${id}>`;
  }

  static role(role: RoleResolvable): RoleMention {
    const id = typeof role === 'string' ? role : role.id;
    return `<@&${id}>`;
  }
}
