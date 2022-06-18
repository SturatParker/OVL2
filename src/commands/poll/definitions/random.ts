import { ApplicationCommandSubCommandData } from 'discord.js';

export const random: ApplicationCommandSubCommandData = {
  name: 'random',
  description: 'Select a random entry from a poll',

  type: 'SUB_COMMAND',
  options: [
    {
      name: 'channel',
      description: 'Channel',
      type: 'CHANNEL',
      required: true,
    },
  ],
};
