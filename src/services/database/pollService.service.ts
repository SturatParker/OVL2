import { Collection, Db } from 'mongodb';
import { IPoll, Poll } from 'src/common/models/poll.model';
import { ISubmission, Submission } from 'src/common/models/submission.model';
import { DatabaseService } from './databaseService.service';
import { MongoService } from './mongoService.service';

export class PollService extends DatabaseService<Poll> {
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
    const winners = await this.db
      .collection<ISubmission>('Submissions')
      .find({ channelId })
      .sort({ voteCount: -1 })
      .limit(1)
      .toArray();
    if (winners.length) return new Submission(winners[0]);
    return;
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
