import { Message } from 'discord.js';
import { ISubmission, Submission } from 'src/common/models/submission.model';
import { mock } from 'test/deep-partial.type';

describe('Submission - Model', () => {
  let target: Submission;
  describe('object', () => {
    let options: ISubmission;
    beforeEach(() => {
      options = {
        album: 'some album',
        artist: 'artist',
        messageId: '012',
        channelId: '123',
        guildId: '234',
        submittedById: 'submittedBy',
        genres: ['Genre 1', 'Genre 2'],
        rawContent: 'raw content',
        url: 'http://example.com',
        voterIds: ['123', '234'],
        year: 2000,
        voteCount: 1,
      };

      target = new Submission(options);
    });
    describe('constructor', () => {
      it('should return an object', () => {
        expect(target).toBeTruthy();
      });

      it('should set values', () => {
        expect(target.album).toEqual(options.album);
        expect(target.artist).toEqual(options.artist);
        expect(target.messageId).toEqual(options.messageId);
        expect(target.channelId).toEqual(options.channelId);
        expect(target.guildId).toEqual(options.guildId);
        expect(target.submittedById).toEqual(options.submittedById);
        expect(target.genres).toEqual(options.genres);
        expect(target.rawContent).toEqual(options.rawContent);
        expect(target.url).toEqual(options.url);
        expect(target.voterIds).toEqual(options.voterIds);
        expect(target.year).toEqual(options.year);
      });
    });

    describe('getters', () => {
      describe('voteCount', () => {
        it('should return a count of voter ids', () => {
          expect(target.voteCount).toEqual(2);
        });
      });

      describe('hyperlink', () => {
        it('should return an emoji hyperlink', () => {
          const expected = `[🔗](${options.url})`;

          expect(target.hyperlink).toEqual(expected);
        });
      });
      describe('displayText', () => {
        it('should concat album, artist and year', () => {
          const expected = `${options.album} *by* ${options.artist} (${options.year})`;

          expect(target.displayText).toEqual(expected);
        });
      });
      describe('linkText', () => {
        it('should concat hyperlink and displaytext', () => {
          const expected = `${target.hyperlink} ${target.displayText}`;

          expect(target.linkText).toEqual(expected);
        });
      });
    });
  });
  describe('static', () => {
    describe('fromMessage', () => {
      it('should return a submission', () => {
        const message = mock<Message<true>>({
          content: 'Album *by* Artist (2008) (Genre 1, Genre 2) <@123456>',
          id: '123',
          channelId: '234',
          guildId: '345',
          mentions: {
            users: {
              first() {
                return { id: '456' };
              },
            },
          },
          url: 'example.com',
        });

        target = Submission.fromMessage(message);

        expect(target).toBeTruthy();
        expect(target.album).toEqual('Album');
        expect(target.artist).toEqual('Artist');
        expect(target.messageId).toEqual(message.id);
        expect(target.channelId).toEqual(message.channelId);
        expect(target.guildId).toEqual(message.guildId);
        expect(target.submittedById).toEqual('456');
        expect(target.genres).toEqual(['Genre 1', 'Genre 2']);
        expect(target.rawContent).toEqual(message.content);
        expect(target.url).toEqual(message.url);
        expect(target.voterIds).toEqual([]);
        expect(target.year).toEqual(2008);
      });
    });
  });
});
