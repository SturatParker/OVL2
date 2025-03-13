import { Collection, Db, Document } from 'mongodb';
import { MongoService } from './mongo.service';

export abstract class DatabaseService<Model extends Document> {
  public abstract collection: Collection<Model>;
  public abstract db: Db;
  constructor(protected mongoService: MongoService) {}
}
