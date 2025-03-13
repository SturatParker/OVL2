import { Client, Intents } from 'discord.js';
import { EnvUtils } from 'src/common/utils/env.utils';
import { MongoService } from 'src/services/database/mongo.service';
import { OVLClientService } from 'src/services/OVLClient.service';

const mongoService = new MongoService();
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

const ovlClient = new OVLClientService(mongoService, client);

console.log('Production: ', EnvUtils.isProduction);
void ovlClient.start();
