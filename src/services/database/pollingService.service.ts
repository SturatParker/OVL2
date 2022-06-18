import { Collection, Db } from 'mongodb';
import { IPoll, Poll } from 'src/common/models/poll.model';
import { DatabaseService } from './databaseService.service';
import { MongoService } from './mongoService.service';

export class PollingService extends DatabaseService<Poll> {
  public collection: Collection<Poll>;
  public db: Db;
  constructor(mongoService: MongoService) {
    super(mongoService);
    this.db = mongoService.db('Polling');
    this.collection = this.db.collection('Polls');
  }

  public async createPoll(poll: IPoll): Promise<Poll> {
    const response = await this.collection.insertOne(poll);
    return new Poll({ ...poll, id: response.insertedId });
  }

  public async getPoll(channelId: string): Promise<Poll | undefined> {
    const response = await this.collection.findOne({ channelId });
    if (!response) return;
    return new Poll(response);
  }
}
