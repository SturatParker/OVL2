import {
  ApplicationCommandManager,
  Client,
  GuildApplicationCommandManager,
  Intents,
} from 'discord.js';
import { ClientEventHandler } from 'src/common/types/ClientEventHandler.type';
import {
  CommandHandler,
  onError,
  onGuildMemberAdd,
  onGuildMemberRemove,
} from 'src/events';
import { ReadyHandler } from './../events/onReady.event';

import { SubmissionService } from './database/databaseService.service';
import { MongoService } from './database/mongoService.service';
import { PollingService } from './database/pollingService.service';

export class OVLClientService {
  client: Client;
  mongoService: MongoService;
  pollService?: PollingService;
  submissionService?: SubmissionService;

  readyHandler?: ReadyHandler;
  commandHandler?: CommandHandler;

  constructor() {
    this.mongoService = new MongoService();
    this.pollService = new PollingService(this.mongoService);
    this.submissionService = new SubmissionService(this.mongoService);
    this.client = new Client({
      partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER'],
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
      ],
    });

    this.registerClientEvents();
    this.registerDevTools();
  }

  async start() {
    await this.startDatabase();
    await this.startClient();
  }

  private async startDatabase() {
    console.log('Connecting to database...');
    await this.mongoService.connect();
    this.pollService = new PollingService(this.mongoService);
    this.submissionService = new SubmissionService(this.mongoService);
    console.log('Established connection to database');
  }

  private async startClient() {
    console.log('Connecting to discord...');
    await this.client.login();
    console.log('Established connection to discord');
  }

  private registerClientEvents() {
    console.log('Registering client event handlers');
    if (!this.pollService || !this.submissionService) return;
    const events: ClientEventHandler<any>[] = [
      onError,
      onGuildMemberAdd,
      onGuildMemberRemove,
    ];

    this.commandHandler = new CommandHandler(this.pollService);
    this.readyHandler = new ReadyHandler(this.commandHandler.commands);

    events.push(this.commandHandler, this.readyHandler);

    events.forEach((handler: ClientEventHandler<any>): void => {
      handler.event;
      handler.callback;
      this.client.on(handler.event, (...args) => {
        handler.callback(...args);
      });
    });

    this.client.on('ready', (client) => {
      const { HOME_GUILD_ID, NODE_ENV } = process.env;
      const homeGuild = HOME_GUILD_ID
        ? client.guilds.cache.get(HOME_GUILD_ID)
        : undefined;
      const isProduction = NODE_ENV === 'production';

      let commands: GuildApplicationCommandManager | ApplicationCommandManager;
      if (homeGuild && !isProduction) {
        commands = homeGuild.commands;
      } else {
        commands = client.application.commands;
      }
    });
  }

  private registerDevTools() {
    if (process.env.NODE_ENV === 'production') return;
    this.client.on('messageCreate', (message) => {
      if (message.author.bot) return;
      switch (message.content) {
        case 'onReady':
          this.readyHandler?.callback(message.client);
          break;
        case 'onError':
          onError.callback(new Error(message.content));
          break;
        case 'onGuildMemberAdd':
          if (!message.member) return;
          onGuildMemberAdd.callback(message.member);
          break;
        case 'onGuildMemberRemove':
          if (!message.member) return;
          onGuildMemberRemove.callback(message.member);
          break;
      }
    });
  }
}
