import { Client, Intents } from 'discord.js';
import 'dotenv/config';
import {
  onError,
  onGuildMemberAdd,
  onGuildMemberRemove,
  onInteractionCreate,
  onReady,
} from 'src/events';

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

[
  onError,
  onGuildMemberAdd,
  onGuildMemberRemove,
  onReady,
  onInteractionCreate,
].forEach((handler) => {
  client.on(handler.event, handler.callback);
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

client.login();
