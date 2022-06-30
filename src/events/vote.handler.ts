import {
  Message,
  MessageEmbed,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from 'discord.js';
import { Poll } from 'src/common/models/poll.model';
import { Submission } from 'src/common/models/submission.model';
import { ClientEventHandler } from 'src/common/types/client-event-handler.type';
import { ColourUtils } from '../common/utils/colour.utils';
import { PollService } from '../services/database/poll.service';
import { SubmissionService } from '../services/database/submission.service';

export class VoteHandler extends ClientEventHandler<'messageReactionAdd'> {
  private voteEmoji = ['👍', '👍🏻', '👍🏼', '👍🏽', '👍🏾', '👍🏿'];
  constructor(
    private pollService: PollService,
    private submissionService: SubmissionService
  ) {
    super('messageReactionAdd');
  }

  async execute(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
  ): Promise<void> {
    // Check the reaction was in a poll channel
    if (!reaction.message.inGuild()) return;
    const reactionEmoji = reaction.emoji.name;
    if (!reactionEmoji) return;
    if (!this.voteEmoji.includes(reactionEmoji)) return;
    const { channelId, guildId } = reaction.message;
    const [poll, existingVotes] = await Promise.all([
      this.pollService.getPoll(channelId),
      this.submissionService.getByVoter(user.id, guildId, channelId),
    ]);

    if (!poll) return;

    // Check the vote is valid
    const message = reaction.message;
    if (message.partial) await message.fetch();
    console.log('Detected vote attempt:', message.content);

    const submission = Submission.fromMessage(message);

    const rejectionReason = this.getRejectionReason(
      user,
      poll,
      submission,
      existingVotes
    );

    // set action
    const action = rejectionReason
      ? this.rejectVote(user, submission, rejectionReason)
      : this.acceptVote(user, submission);

    // cleanup
    await Promise.all([action, reaction.remove()]);
    return;
  }

  private async acceptVote(
    user: User | PartialUser,
    submission: Submission
  ): Promise<Message> {
    await this.submissionService.recordVote(submission, user.id);
    return this.acknowledgeVote(user, submission.rawContent);
  }

  private getRejectionReason(
    user: User | PartialUser,
    poll: Poll,
    submission: Submission,
    existingVotes: Submission[]
  ): string | undefined {
    // Check for voting for the same item twice
    const isDuplicateVote = existingVotes.some(
      (vote) => vote.messageId == submission.messageId
    );
    if (isDuplicateVote) return 'you have already voted for it';

    // Check for voting more than the max number of times
    if (existingVotes.length >= poll.maxVotes)
      return `you have already cast the maximum number of votes: ${poll.maxVotes}`;

    // Check for voting for own submissions more than the max number of times
    const existingSelfVotes = existingVotes.filter(
      (vote) => vote.submittedById == user.id
    );
    if (
      existingSelfVotes.length >= poll.maxSelfVotes &&
      submission.submittedById == user.id
    )
      return `you have already cast the maximum number of votes for your own submissions: ${poll.maxSelfVotes}`;
    return;
  }

  private async acknowledgeVote(
    user: User | PartialUser,
    voteMessage: string
  ): Promise<Message> {
    const embed = new MessageEmbed()
      .setTitle('Success')
      .setDescription(`Thanks for voting for ***${voteMessage}***`)
      .setColor(ColourUtils.success);
    return user.send({ embeds: [embed] });
  }

  private async rejectVote(
    user: User | PartialUser,
    submission: Submission,
    reason: string
  ): Promise<Message> {
    console.log(
      `Rejected ${user.username ?? ''}'s vote for ${
        submission.rawContent
      }. Reason: ${reason}`
    );
    const embed = new MessageEmbed()
      .setTitle('Vote failed')
      .setDescription(
        `We couldn't register your vote for ***${
          submission.rawContent
        }*** because ${reason || 'unspecified reason'}`
      )
      .setColor(ColourUtils.error);
    return user.send({ embeds: [embed] });
  }
}
