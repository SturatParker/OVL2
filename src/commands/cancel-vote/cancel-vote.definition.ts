import { SlashCommandBuilder } from '@discordjs/builders';
export const cancelVote = new SlashCommandBuilder()
  .setName('cancel_vote')
  .setDescription('Cancel a vote')
  .addChannelOption((option) =>
    option.setName('channel').setDescription('Channel').setRequired(true)
  );
