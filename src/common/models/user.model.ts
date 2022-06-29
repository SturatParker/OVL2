import { ObjectId, WithId } from 'mongodb';

export interface ICancellationCounter {
  pollId: string;
  count: number;
}

export interface IUser {
  _id?: ObjectId;
  userId: string;
  cancellations: ICancellationCounter[];
}

export class User implements IUser {
  _id: ObjectId;
  userId: string;
  cancellations: ICancellationCounter[];
  constructor(options: WithId<IUser>) {
    this._id = options._id;
    this.userId = options.userId;
    this.cancellations = options.cancellations.map((cancellation) => ({
      ...cancellation,
    }));
  }
}
