export interface ISubmission {
  messageId: string;
  channelId: string;
  guildId: string;
  url: string;
  submittedBy: string;
  voterIds: string[];
  voteCount: number;
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
}
