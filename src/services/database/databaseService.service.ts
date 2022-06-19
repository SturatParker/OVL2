import { Collection, Db } from 'mongodb';
import { MongoService } from './mongoService.service';

export abstract class DatabaseService<Model> {
  public abstract collection: Collection<Model>;
  public abstract db: Db;
  constructor(protected mongoService: MongoService) {}
}
