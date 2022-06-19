import {
  Collection,
  Db,
  DbOptions,
  MongoClient,
  ServerApiVersion,
} from 'mongodb';

export class MongoService {
  private client: MongoClient;
  private url: string;
  private uri: string;
  public collections: { votes?: Collection; polls?: Collection } = {};

  constructor() {
    const { DB_USER, DB_PASSWORD, DB_URL } = process.env;
    if (!DB_USER || !DB_PASSWORD || !DB_URL)
      throw new Error('Missing database configuration');
    this.url = DB_URL;
    this.uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_URL}/?retryWrites=true&w=majority`;
    this.client = new MongoClient(this.uri, {
      serverApi: ServerApiVersion.v1,
    });
  }
  public async connect(): Promise<MongoClient> {
    console.log(`Connecting to ${this.url}`);
    await this.client.connect();
    return this.client;
  }

  public db(dbName?: string, options?: DbOptions): Db {
    return this.client.db(dbName, options);
  }
}
