import { SlashCommandBuilder } from '@discordjs/builders';
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

export const myVotes = new SlashCommandBuilder()
  .setName('my_votes')
  .setDescription('Who have I voted for?')
  .addChannelOption((option) =>
    option.setName('channel').setDescription('Channel')
  );
