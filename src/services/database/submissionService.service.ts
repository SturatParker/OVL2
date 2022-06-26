import { Message } from 'discord.js';
import { Collection, Db, Filter } from 'mongodb';
import { ISubmission, Submission } from 'src/common/models/submission.model';
import { DatabaseService } from './databaseService.service';
import { MongoService } from './mongoService.service';

export class SubmissionService extends DatabaseService<ISubmission> {
  public collection: Collection<ISubmission>;
  public db: Db;

  constructor(mongoService: MongoService) {
    super(mongoService);
    this.db = mongoService.db('Polling');
    this.collection = this.db.collection('Submissions');
  }

  async getByVoter(
    voterId: string,
    guildId: string,
    channelId?: string
  ): Promise<Submission[]> {
    const filter: Filter<ISubmission> = {
      guildId,
      voterIds: [voterId],
    };
    if (channelId) filter.channelId = channelId;
    const submissions = await this.collection.find(filter).toArray();
    return submissions.map((submission) => new Submission(submission));
  }

  async getBySubmitterIds(userId: string): Promise<Submission[]> {
    const submissions = await this.collection
      .find({ submittedById: userId })
      .toArray();
    return submissions.map((submission) => new Submission(submission));
  }

  async recordVote(submission: Submission, voterId: string): Promise<void> {
    await this.collection.findOneAndUpdate(
      { messageId: submission.messageId },
      {
        $set: {
          rawContent: submission.rawContent,
          album: submission.album,
          artist: submission.artist,
          year: submission.year,
          genres: submission.genres,
          messageId: submission.messageId,
          channelId: submission.channelId,
          guildId: submission.guildId,
          url: submission.url,
          submittedById: submission.submittedById,
        },
        $push: { voterIds: voterId },
        $inc: { voteCount: 1 },
      },
      { upsert: true }
    );
    return;
  }

  async getSubmissionFromMessage(message: Message<true>): Promise<Submission> {
    const savedSubmission = await this.collection.findOne({
      messageId: message.id,
    });
    return savedSubmission
      ? new Submission(savedSubmission)
      : Submission.fromMessage(message);
  }
}
