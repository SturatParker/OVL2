import { Message } from 'discord.js';

export interface ISubmission {
  rawContent: string;
  album: string;
  artist: string;
  year: number;
  genres: string[];
  messageId: string;
  channelId: string;
  guildId: string;
  url: string;
  submittedById: string;
  voterIds: string[];
  voteCount?: number;
}

export class Submission implements ISubmission {
  rawContent: string;
  album: string;
  artist: string;
  year: number;
  genres: string[];
  messageId: string;
  channelId: string;
  guildId: string;
  url: string;
  submittedById: string;
  voterIds: string[];
  get voteCount(): number {
    return this.voterIds.length;
  }

  constructor(options: ISubmission) {
    this.rawContent = options.rawContent;
    this.album = options.album;
    this.artist = options.artist;
    this.year = options.year;
    this.genres = options.genres;
    this.messageId = options.messageId;
    this.channelId = options.channelId;
    this.guildId = options.guildId;
    this.url = options.url;
    this.submittedById = options.submittedById;
    this.voterIds = [...options.voterIds];
  }

  public get hyperlink(): string {
    return `[🔗](${this.url})`;
  }
  public get displayText(): string {
    return `${this.album} *by* ${this.artist} (${this.year})`;
  }

  public get linkText(): string {
    return `${this.hyperlink} ${this.displayText}`;
  }

  static fromMessage(message: Message<true>): Submission {
    let content = message.content.replace(/<@\d*>/, '');
    const byDelim = ' *by* ';
    const byIndex = content.indexOf(byDelim);
    const album = content.slice(0, byIndex);
    content = content.slice(byIndex + byDelim.length);
    const yearIndex = content.search(/\(\d{4}\)/);
    const artist = content.slice(0, yearIndex - 1);

    const year = parseInt(content.slice(yearIndex + 1, yearIndex + 5));
    content = content.slice(yearIndex + 6);
    const regex = /^[\s]+|[\s]+$|\(|\)|(?<=,)\s*/g;
    const genres = content.replace(regex, '').split(',');

    return new Submission({
      rawContent: message.content,
      album,
      artist,
      year,
      genres,
      messageId: message.id,
      channelId: message.channelId,
      guildId: message.guildId,
      submittedById: message.mentions.users.first()?.id ?? '',
      voterIds: [],
      url: message.url,
    });
  }
}
