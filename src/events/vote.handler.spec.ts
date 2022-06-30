import { MessageReaction, User } from 'discord.js';
import { PollService } from 'src/services/database/poll.service';
import { SubmissionService } from 'src/services/database/submission.service';
import { mock } from 'test/deep-partial.type';
import { VoteHandler } from './vote.handler';
describe('VoteHander', () => {
  let target: VoteHandler;

  let pollService: PollService;
  let submissionService: SubmissionService;

  beforeEach(() => {
    pollService = mock<PollService>({ getPoll: () => undefined });
    submissionService = mock<SubmissionService>({});

    target = new VoteHandler(pollService, submissionService);
  });

  describe('constructor', () => {
    it('should create an object', () => {
      expect(target).toBeTruthy();
    });
  });

  describe('execute', () => {
    it('should reject', async () => {
      const interaction = mock<MessageReaction>({
        message: {
          inGuild() {
            return true;
          },
          content: 'Album _by_ Arist (2000) (Genre) <@1234567890>',
          guildId: '1234567890',
          channelId: '0123456789',
          partial: false,
          reply: () => undefined,
        },
        emoji: { name: '👍' },
      });
      const user = mock<User>({});

      spyOn(pollService, 'getPoll');

      await target.execute(interaction, user);
    });
  });
});
