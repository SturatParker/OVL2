import {
  ApplicationCommandManager,
  Client,
  GuildApplicationCommandManager,
  Intents,
} from 'discord.js';
import {
  onError,
  onGuildMemberAdd,
  onGuildMemberRemove,
  onReady,
} from 'src/events';
import { onInteractionCreate } from './../events/onInteractionCreate.event';
import { SubmissionService } from './database/databaseService.service';
import { MongoService } from './database/mongoService.service';
import { PollingService } from './database/pollingService.service';

export class OVLClientService {
  client: Client;
  mongoService: MongoService;
  pollService: PollingService;
  submissionService: SubmissionService;

  constructor() {
    this.mongoService = new MongoService();
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
    [
      onError,
      onGuildMemberAdd,
      onGuildMemberRemove,
      onReady,
      onInteractionCreate,
    ].forEach((handler) => {
      this.client.on(handler.event, handler.callback);
    });

    this.client.on('ready', (client) => {
      const homeGuild = client.guilds.cache.get(process.env.HOME_GUILD_ID);
      const isProduction = process.env.NODE_ENV === 'production';

      let commands: GuildApplicationCommandManager | ApplicationCommandManager;
      if (homeGuild && !isProduction) {
        commands = homeGuild.commands;
      } else {
        commands = client.application.commands;
      }

      void commands.create({
        name: 'poll',
        description: 'Poll',
        options: [
          {
            name: 'subcommand',
            description: 'subcommand',
            type: 'SUB_COMMAND',
            options: [],
          },
        ],
      });
    });
  }

  private registerDevTools() {
    if (process.env.NODE_ENV === 'production') return;
    this.client.on('messageCreate', (message) => {
      if (message.author.bot) return;
      switch (message.content) {
        case 'onReady':
          onReady.callback(message.client);
          break;
        case 'onError':
          onError.callback(new Error(message.content));
          break;
        case 'onGuildMemberAdd':
          onGuildMemberAdd.callback(message.member);
          break;
        case 'onGuildMemberRemove':
          onGuildMemberRemove.callback(message.member);
          break;
      }
    });
  }
}
