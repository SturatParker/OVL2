import { ObjectId } from 'mongodb';

export interface IPoll {
  id?: ObjectId;
  channelId: string;
}

export default class Poll implements IPoll {
  id?: ObjectId;
  channelId: string;

  constructor(options: IPoll) {
    this.id = options.id;
    this.channelId = options.channelId;
  }
}
