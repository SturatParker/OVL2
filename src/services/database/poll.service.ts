import { Collection, Db } from 'mongodb';
import { IPoll, Poll } from 'src/common/models/poll.model';
import { ISubmission, Submission } from 'src/common/models/submission.model';
import { DatabaseService } from './database.service';
import { MongoService } from './mongo.service';

export class PollService extends DatabaseService<IPoll> {
  public collection: Collection<IPoll>;
  public db: Db;
  constructor(mongoService: MongoService) {
    super(mongoService);
    this.db = mongoService.db('Polling');
    this.collection = this.db.collection('Polls');
  }

  public async createPoll(poll: IPoll): Promise<Poll> {
    const result = await this.collection.insertOne(poll);
    return new Poll({ ...poll, _id: result.insertedId });
  }

  public async getPoll(channelId: string): Promise<Poll | undefined> {
    const response = await this.collection.findOne({ channelId });
    if (!response) return;
    return new Poll(response);
  }

  public async deletePoll(channelId: string): Promise<void> {
    await Promise.all([
      this.mongoService
        .db('Polling')
        .collection<ISubmission>('Submissions')
        .deleteMany({ channelId }),
      this.collection.findOneAndDelete({ channelId }),
    ]);
    return;
  }

  public async getWinner(channelId: string): Promise<Submission | undefined> {
    const winners = await this.getTop(channelId, 1);
    if (winners.length) return winners[0];
    return;
  }

  public async addVotes(channelId: string, quantity = 1): Promise<void> {
    await this.collection.updateOne(
      { channelId },
      { $inc: { voteCount: quantity } }
    );
  }

  public async getAllVoters(channelId: string): Promise<Set<string>> {
    const documents = await this.db
      .collection<ISubmission>('Submissions')
      .find({ channelId })
      .toArray();
    return documents
      .flatMap((item) => item.voterIds)
      .reduce((set, id) => set.add(id), new Set<string>());
  }

  public async removeVotes(channelId: string, quantity = 1): Promise<void> {
    return this.addVotes(channelId, 0 - quantity);
  }

  public async getTop(channelId: string, count: number): Promise<Submission[]> {
    const winners = await this.db
      .collection<ISubmission>('Submissions')
      .find({ channelId })
      .sort({ voteCount: -1 })
      .limit(count)
      .toArray();
    return winners.map((sumission) => new Submission(sumission));
  }

  public async getRandom(channelId: string): Promise<Submission | undefined> {
    const randoms = await this.db
      .collection<ISubmission>('Submissions')
      .aggregate<ISubmission>([
        { $match: { channelId } },
        { $sample: { size: 1 } },
      ])
      .toArray();
    if (randoms.length) return new Submission(randoms[0]);
    return;
  }
}
