import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Client } from 'discord.js';
import { Command } from 'src/common/models/command.model';
import { ClientEventHandler } from 'src/common/types/client-event-handler.type';
import {
  CommandHandler,
  onError,
  onGuildMemberAdd,
  onGuildMemberRemove,
  ReadyHandler,
  VoteHandler,
} from 'src/events';
import { MyVotesCommand } from './../commands/my-votes/my-votes.command';
import { PollCommand } from './../commands/poll/poll.command';
import { MongoService } from './database/mongoService.service';
import { PollService } from './database/pollService.service';
import { SubmissionService } from './database/submissionService.service';

export class OVLClientService {
  private readonly homeGuildId = process.env.HOME_GUILD_ID;
  private readonly discordToken = process.env.DISCORD_TOKEN;
  pollService: PollService;
  submissionService: SubmissionService;

  readyHandler?: ReadyHandler;
  voteHandler: VoteHandler;
  commandHandler: CommandHandler = new CommandHandler();

  commands: Command[] = [];

  constructor(private mongoService: MongoService, private client: Client) {
    this.pollService = new PollService(this.mongoService);
    this.submissionService = new SubmissionService(this.mongoService);

    this.voteHandler = new VoteHandler(
      this.pollService,
      this.submissionService
    );
  }

  async start(): Promise<void> {
    this.registerClientEvents();
    this.registerDevTools();
    await this.startDatabase();
    await this.startClient();
    await this.registerCommands();
    return;
  }

  private async registerCommands(): Promise<void> {
    const clientId = this.client.user?.id;
    if (!this.discordToken || !clientId || !this.homeGuildId) return;
    console.log('Registering commands via REST');

    const body = this.commands.map((command) => command.toJSON());
    const rest = new REST({ version: '9' }).setToken(this.discordToken);
    await rest.put(
      Routes.applicationGuildCommands(clientId, this.homeGuildId),
      {
        body,
      }
    );
    await rest.put(Routes.applicationCommands(clientId), { body: [] });
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
    this.commands.push(
      new PollCommand(this.pollService),
      new MyVotesCommand(this.submissionService)
    );

    this.commandHandler.setCommands(...this.commands);
    this.readyHandler = new ReadyHandler(this.commands);

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
          void this.readyHandler?.execute(message.client);
          break;
        case 'onError':
          void onError.execute(new Error(message.content));
          break;
        case 'onGuildMemberAdd':
          if (!message.member) return;
          void onGuildMemberAdd.execute(message.member);
          break;
        case 'onGuildMemberRemove':
          if (!message.member) return;
          void onGuildMemberRemove.execute(message.member);
          break;
      }
    });
    return;
  }
}
