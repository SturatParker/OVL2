import { Collection, Db } from 'mongodb';
import { ISubmission } from 'src/common/models/submission.model';
import { MongoService } from './mongoService.service';

export abstract class DatabaseService<Model> {
  public abstract collection: Collection<Model>;
  public abstract db: Db;
  constructor(private mongoService: MongoService) {}
}

export class SubmissionService extends DatabaseService<ISubmission> {
  public collection: Collection<ISubmission>;
  public db: Db;

  constructor(mongoService: MongoService) {
    super(mongoService);
    this.db = mongoService.db('Polling');
    this.collection = this.db.collection('Submissions');
  }
}
