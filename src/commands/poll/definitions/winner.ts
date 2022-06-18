import { ApplicationCommandSubCommandData } from 'discord.js';

export const winner: ApplicationCommandSubCommandData = {
  name: 'winner',
  description: 'Select the winning entry from a poll',

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
