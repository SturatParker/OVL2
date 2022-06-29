import { Collection, Db } from 'mongodb';
import { IUser, User } from 'src/common/models/user.model';
import { DatabaseService } from './database.service';
import { MongoService } from './mongo.service';

export class UserService extends DatabaseService<IUser> {
  public collection: Collection<IUser>;
  public db: Db;

  constructor(mongoService: MongoService) {
    super(mongoService);
    this.db = mongoService.db('Polling');
    this.collection = this.db.collection('Users');
  }

  async getUser(userId: string): Promise<User> {
    const document = await this.collection.findOne({ userId });
    if (document) return new User(document);
    const insert = { userId, cancellations: [] };
    const result = await this.collection.insertOne(insert);
    return new User({ ...insert, _id: result.insertedId });
  }

  async cancelVote(
    userId: string,
    channelId: string,
    count = 1
  ): Promise<void> {
    const user = await this.getUser(userId);
    if (
      user.cancellations.some(
        (cancellation) => (cancellation.pollId = channelId)
      )
    ) {
      await this.collection.updateOne(
        { userId, 'cancellations.pollId': channelId },
        { $inc: { 'cancellations.$.count': count } },
        { upsert: true }
      );
    } else
      await this.collection.updateOne(
        { userId },
        {
          $push: {
            cancellations: { pollId: channelId, count },
          },
        }
      );
  }
}
