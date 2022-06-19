import { Message } from 'discord.js';

export interface ISubmission {
  messageId: string;
  channelId: string;
  guildId: string;
  url: string;
  submittedBy: string;
  voterIds: string[];
}

export class Submission implements ISubmission {
  messageId: string;
  channelId: string;
  guildId: string;
  url: string;
  submittedBy: string;
  voterIds: string[];
  get voteCount(): number {
    return this.voterIds.length;
  }

  constructor(options: ISubmission) {
    this.messageId = options.messageId;
    this.channelId = options.channelId;
    this.guildId = options.guildId;
    this.url = options.url;
    this.submittedBy = options.submittedBy;
    this.voterIds = options.voterIds;
  }

  static fromMessage(message: Message<true>): Submission {
    return new Submission({
      messageId: message.id,
      channelId: message.channelId,
      guildId: message.guildId,
      submittedBy: message.mentions.users.first()?.id ?? '',
      voterIds: [],
      url: message.url,
    });
  }
}
