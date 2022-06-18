import {
  Collection,
  Db,
  DbOptions,
  MongoClient,
  ServerApiVersion,
} from 'mongodb';

export class MongoService {
  private client: MongoClient;
  private uri: string;
  public collections: { votes?: Collection; polls?: Collection } = {};

  constructor() {
    const { DB_USER, DB_PASSWORD, DB_URL } = process.env;
    this.uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_URL}/?retryWrites=true&w=majority`;
    this.client = new MongoClient(this.uri, {
      serverApi: ServerApiVersion.v1,
    });
  }
  public async connect() {
    console.log(`Connecting to ${this.uri}`);
    return await this.client.connect();
  }

  public db(dbName?: string, options?: DbOptions): Db {
    return this.client.db(dbName, options);
  }
}

export abstract class DatabaseService {
  public abstract collections: { [key: string]: Collection };
  public abstract db: Db;
  constructor(private mongoService: MongoService) {}
}

export class PollingService extends DatabaseService {
  public collections: { polls: Collection };
  public db: Db;
  constructor(private databaseService: MongoService) {
    super(databaseService);
    this.db = databaseService.db('Polling');
    this.collections = {
      polls: this.db.collection('polls'),
    };
  }
}
