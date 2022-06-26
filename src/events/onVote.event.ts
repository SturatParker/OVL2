import { Message, MessageEmbed, PartialUser, User } from 'discord.js';
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
          messageReaction.message
        );

        // set action
        const action = rejectionReason
          ? this.rejectVote(user, msgContent, rejectionReason)
          : this.acceptVote(messageReaction.message, user, msgContent);

        // cleanup
        await Promise.all([action, messageReaction.remove()]);
        return;
      }
    );
  }

  private async acceptVote(
    message: Message<true>,
    user: User | PartialUser,
    msgContent: string
  ): Promise<Message> {
    const submission = await this.submissionService.getSubmissionFromMessage(
      message
    );
    await this.submissionService.recordVote(submission, user.id);
    return this.acknowledgeVote(user, msgContent);
  }

  private async getRejectionReason(
    user: User | PartialUser,
    poll: Poll,
    message: Message<true>
  ): Promise<string | undefined> {
    const existingVotes = await this.submissionService.getByVoter(
      user.id,
      message.guildId,
      message.channelId
    );

    // Check for voting for the same item twice
    const isDuplicateVote = existingVotes.some(
      (submission) => submission.messageId == message.id
    );
    if (isDuplicateVote) return 'you have already voted for it';

    // Check for voting more than the max number of times
    if (existingVotes.length >= poll.maxVotes)
      return `you have already cast the maximum number of votes: ${poll.maxVotes}`;

    // Check for voting for own submissions more than the max number of times
    const existingSelfVotes = existingVotes.filter(
      (submission) => (submission.submittedById = user.id)
    );
    if (
      existingSelfVotes.length >= poll.maxSelfVotes &&
      message.mentions.users.first()?.id == user.id
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
