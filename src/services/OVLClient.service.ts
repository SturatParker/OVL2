import { Client } from 'discord.js';
import { ClientEventHandler } from 'src/common/types/ClientEventHandler.type';
import {
  CommandHandler,
  onError,
  onGuildMemberAdd,
  onGuildMemberRemove,
  ReadyHandler,
  VoteHandler,
} from 'src/events';

import { MongoService } from './database/mongoService.service';
import { PollService } from './database/pollService.service';
import { SubmissionService } from './database/submissionService.service';

export class OVLClientService {
  pollService?: PollService;
  submissionService?: SubmissionService;

  readyHandler?: ReadyHandler;
  voteHandler?: VoteHandler;
  commandHandler?: CommandHandler;

  constructor(private mongoService: MongoService, private client: Client) {
    this.pollService = new PollService(this.mongoService);
    this.submissionService = new SubmissionService(this.mongoService);

    this.registerClientEvents();
    this.registerDevTools();
  }

  async start(): Promise<void> {
    await this.startDatabase();
    await this.startClient();
    return;
  }

  private async startDatabase(): Promise<void> {
    console.log('Connecting to database...');
    await this.mongoService.connect();
    console.log('Established connection to database');
    return;
  }

  private async startClient(): Promise<void> {
    console.log('Connecting to discord...');
    await this.client.login();
    console.log('Established connection to discord');
    return;
  }

  private registerClientEvents(): void {
    console.log('Registering client event handlers');
    if (!this.pollService || !this.submissionService) return;

    this.voteHandler = new VoteHandler(
      this.pollService,
      this.submissionService
    );
    this.commandHandler = new CommandHandler(this.pollService);
    this.readyHandler = new ReadyHandler(this.commandHandler.commands);

    const events: ClientEventHandler[] = [
      onError,
      onGuildMemberAdd,
      onGuildMemberRemove,
      this.voteHandler,
      this.commandHandler,
      this.readyHandler,
    ];

    events.forEach((handler: ClientEventHandler): void => {
      handler.registerClient(this.client);
    });
    return;
  }

  private registerDevTools(): void {
    if (process.env.NODE_ENV === 'production') return;
    this.client.on('messageCreate', (message) => {
      if (message.author.bot) return;
      switch (message.content) {
        case 'onReady':
          void this.readyHandler?.callback(message.client);
          break;
        case 'onError':
          void onError.callback(new Error(message.content));
          break;
        case 'onGuildMemberAdd':
          if (!message.member) return;
          void onGuildMemberAdd.callback(message.member);
          break;
        case 'onGuildMemberRemove':
          if (!message.member) return;
          void onGuildMemberRemove.callback(message.member);
          break;
      }
    });
    return;
  }
}
