import { Message } from 'discord.js';
import { Collection, Db } from 'mongodb';
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

  async getByVoterIds(
    channelId: string,
    userId: string
  ): Promise<Submission[]> {
    const submissions = await this.collection
      .find({
        channelId,
        voterIds: [userId],
      })
      .toArray();
    return submissions.map((submission) => new Submission(submission));
  }

  async getBySubmitterIds(userId: string): Promise<Submission[]> {
    const submissions = await this.collection
      .find({ submittedBy: userId })
      .toArray();
    return submissions.map((submission) => new Submission(submission));
  }

  async recordVote(submission: Submission, voterId: string): Promise<void> {
    await this.collection.findOneAndUpdate(
      { messageId: submission.messageId },
      {
        $set: {
          messageId: submission.messageId,
          channelId: submission.channelId,
          guildId: submission.guildId,
          url: submission.url,
          submittedBy: submission.submittedBy,
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
