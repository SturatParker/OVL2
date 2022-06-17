import { ApplicationCommandSubCommandData } from 'discord.js';

export const open: ApplicationCommandSubCommandData = {
  name: 'open',
  description: 'Open a poll for voting',

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
