import { Collection, Db } from 'mongodb';
import Poll from 'src/common/models/poll.model';
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
}
