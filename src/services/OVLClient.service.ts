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
  VoteHandler,
} from 'src/events';
import { CancelVoteCommand } from './../commands/cancel-vote/cancel-vote.command';
import { MyVotesCommand } from './../commands/my-votes/my-votes.command';
import { PollCommand } from './../commands/poll/poll.command';
import { EnvUtils } from './../common/utils/env.utils';
import { onReady } from './../events/ready.handler';
import { MongoService } from './database/mongo.service';
import { PollService } from './database/poll.service';
import { SubmissionService } from './database/submission.service';
import { UserService } from './database/user.service';

export class OVLClientService {
  private readonly homeGuildId = process.env.HOME_GUILD_ID;
  private readonly discordToken = process.env.DISCORD_TOKEN;
  pollService: PollService;
  submissionService: SubmissionService;
  userService: UserService;

  voteHandler: VoteHandler;
  commandHandler: CommandHandler = new CommandHandler();

  private readonly commands: Command[] = [];

  constructor(private mongoService: MongoService, private client: Client) {
    this.pollService = new PollService(this.mongoService);
    this.submissionService = new SubmissionService(this.mongoService);
    this.userService = new UserService(this.mongoService);

    this.voteHandler = new VoteHandler(
      this.pollService,
      this.submissionService
    );

    this.commands.push(
      new PollCommand(this.pollService),
      new MyVotesCommand(this.pollService, this.submissionService),
      new CancelVoteCommand(
        this.userService,
        this.pollService,
        this.submissionService
      )
    );
  }

  async start(): Promise<void> {
    this.registerClientEvents();
    await this.startDatabase();
    await this.startClient();
    await this.registerCommands();
    console.log('Start up complete');
    return;
  }

  private async registerCommands(): Promise<void> {
    const clientId = this.client.user?.id;
    if (!this.discordToken || !clientId) return;
    const body = this.commands.map((command) => command.toJSON());
    const rest = new REST({ version: '9' }).setToken(this.discordToken);
    const commandNames = this.commands.map((command) => command.name);

    if (EnvUtils.isProduction) {
      console.log(`Registering global commands via REST:`);
      console.group();
      console.log(commandNames);
      console.groupEnd();
      await rest.put(Routes.applicationCommands(clientId), { body });
      return;
    }
    if (this.homeGuildId) {
      console.log(`Registering global commands via REST:`);
      console.group();
      console.log(commandNames);
      console.groupEnd();
      await rest.put(
        Routes.applicationGuildCommands(clientId, this.homeGuildId),
        {
          body,
        }
      );
      return;
    }
    console.log('Failed to register commands');
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
    console.log('Registering client event handlers...');

    this.commandHandler.setCommands(...this.commands);
    const events: ClientEventHandler[] = [
      onError,
      onGuildMemberAdd,
      onGuildMemberRemove,
      onReady,
      this.voteHandler,
      this.commandHandler,
    ];

    events.forEach((handler: ClientEventHandler): void => {
      handler.registerClient(this.client);
    });
    return;
  }
}
