import { ObjectId } from 'mongodb';

export interface IPoll {
  id?: ObjectId;
  guildId: string;
  channelId: string;
  isOpen: boolean;
  votes: ObjectId[];
  maxVotes: number;
  maxSelfVotes: number;
}

export class Poll implements IPoll {
  id?: ObjectId;
  guildId: string;
  channelId: string;
  isOpen: boolean;
  votes: ObjectId[];
  maxVotes: number;
  maxSelfVotes: number;

  constructor(options: IPoll) {
    this.id = options.id;
    this.guildId = options.guildId;
    this.channelId = options.channelId;
    this.isOpen = options.isOpen;
    this.votes = options.votes;
    this.maxVotes = options.maxVotes;
    this.maxSelfVotes = options.maxSelfVotes;
  }
}
