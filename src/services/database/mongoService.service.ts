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
    await this.client.connect();
    return this.client;
  }

  public db(dbName?: string, options?: DbOptions): Db {
    return this.client.db(dbName, options);
  }
}
