import { ObjectId, WithId } from 'mongodb';

export interface IPoll {
  guildId: string;
  channelId: string;
  isOpen: boolean;
  maxVotes: number;
  maxSelfVotes: number;
  maxCancels: number;
  voteCount?: number;
}

export class Poll implements IPoll {
  _id: ObjectId;
  guildId: string;
  channelId: string;
  isOpen: boolean;
  maxVotes: number;
  maxSelfVotes: number;
  maxCancels: number;
  voteCount: number;

  constructor(options: WithId<IPoll>) {
    this._id = options._id;
    this.guildId = options.guildId;
    this.channelId = options.channelId;
    this.isOpen = options.isOpen;
    this.maxVotes = options.maxVotes;
    this.maxSelfVotes = options.maxSelfVotes;
    this.maxCancels = options.maxCancels;
    this.voteCount = options.voteCount ?? 0;
  }
}
