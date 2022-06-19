import {
  Message,
  MessageEmbed,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from 'discord.js';
import { Poll } from 'src/common/models/poll.model';
import { ClientEventHandler } from 'src/common/types/ClientEventHandler.type';
import { ColourUtils } from '../common/utils/ColourUtils';
import { PollService } from '../services/database/pollService.service';
import { SubmissionService } from '../services/database/submissionService.service';

export class VoteHandler extends ClientEventHandler<'messageReactionAdd'> {
  private voteEmoji = ['👍', '👍🏻', '👍🏼', '👍🏽', '👍🏾', '👍🏿'];
  constructor(
    private pollService: PollService,
    private submissionService: SubmissionService
  ) {
    super(
      'messageReactionAdd',
      async (messageReaction, user): Promise<void> => {
        // Early return if not a vote attempt
        if (!messageReaction.message.inGuild()) return;
        const reactionEmoji = messageReaction.emoji.name;
        if (!reactionEmoji) return;
        if (!this.voteEmoji.includes(reactionEmoji)) return;

        const poll = await this.pollService.getPoll(
          messageReaction.message.channelId
        );
        if (!poll) return;
        const message = messageReaction.message;
        if (message.partial) await message.fetch();
        console.log('Detected vote attempt:', messageReaction.message.content);

        const msgContent = messageReaction.message.content.replace(
          /<@!?\d+>/g,
          ''
        );

        const rejectionReason = await this.getRejectionReason(
          user,
          poll,
          messageReaction
        );

        // otherwise, record vote

        if (rejectionReason) {
          this.rejectVote(user, msgContent, rejectionReason);
        } else {
          const submission =
            await this.submissionService.getSubmissionFromMessage(
              messageReaction.message
            );
          this.submissionService.recordVote(submission, user.id);
          this.acknowledgeVote(user, msgContent);
        }

        // cleanup
        messageReaction.remove();
      }
    );
  }

  private async getRejectionReason(
    user: User | PartialUser,
    poll: Poll,
    messageReaction: MessageReaction | PartialMessageReaction
  ): Promise<string | undefined> {
    const existingVotes = await this.submissionService.getByVoterIds(
      messageReaction.message.channelId,
      user.id
    );

    // Check for voting for the same item twice
    const isDuplicateVote = existingVotes.some(
      (submission) => submission.messageId == messageReaction.message.id
    );
    if (isDuplicateVote) return 'you have already voted for it';

    // Check for voting more than the max number of times
    if (existingVotes.length >= poll.maxVotes)
      return `you have already cast the maximum number of votes: ${poll.maxVotes}`;

    // Check for voting for own submissions more than the max number of times
    const existingSelfVotes = existingVotes.filter(
      (submission) => (submission.submittedBy = user.id)
    );
    if (
      existingSelfVotes.length >= poll.maxSelfVotes &&
      messageReaction.message.mentions.users.first()?.id == user.id
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
    voteMessage: string,
    reason: string
  ): Promise<Message> {
    const embed = new MessageEmbed()
      .setTitle('Vote failed')
      .setDescription(
        `We couldn't register your vote for ***${voteMessage}*** because ${
          reason || 'unspecified reason'
        }`
      )
      .setColor(ColourUtils.error);
    return user.send({ embeds: [embed] });
  }
}
