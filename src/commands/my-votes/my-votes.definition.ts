import { SlashCommandBuilder } from '@discordjs/builders';

export const myVotes = new SlashCommandBuilder()
  .setName('my_votes')
  .setDescription('Who have I voted for?')
  .addChannelOption((option) =>
    option.setName('channel').setDescription('Channel')
  );
