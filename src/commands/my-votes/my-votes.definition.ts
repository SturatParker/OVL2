import { ApplicationCommandData } from 'discord.js';

export const myvotesDefinition: ApplicationCommandData = {
  name: 'my_votes',
  description: 'Who have I voted for?',
  type: 'CHAT_INPUT',
  options: [
    {
      name: 'channel',
      description: 'Channel',
      type: 'CHANNEL',
      required: false,
    },
  ],
};
