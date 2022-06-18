import {
  ApplicationCommandManager,
  Client,
  GuildApplicationCommandManager,
  Intents,
} from 'discord.js';
import 'dotenv/config';
import {
  onError,
  onGuildMemberAdd,
  onGuildMemberRemove,
  onReady,
} from 'src/events';
import { MongoService, PollingService } from './services/database.service';

void (async () => {
  const client = new Client({
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

  [onError, onGuildMemberAdd, onGuildMemberRemove, onReady].forEach(
    (handler) => {
      client.on(handler.event, handler.callback);
    }
  );

  client.on('ready', (client) => {
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

  client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    if (process.env.NODE_ENV === 'production') return;
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

  const mongoService = new MongoService();
  const pollingService = new PollingService(mongoService);

  console.log('Connecting to mongodb...');
  await mongoService.connect();
  console.log('Connection to mongodb established');
  console.log('Connecting to discord...');
  await client.login();
  console.log('Connected to discord');
})();
