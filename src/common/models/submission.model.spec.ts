import { ISubmission, Submission } from 'src/common/models/submission.model';
describe('Submission - Model', () => {
  let target: Submission;
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
