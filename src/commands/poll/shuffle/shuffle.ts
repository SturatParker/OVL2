import { ApplicationCommandSubCommandData } from 'discord.js';

export const shuffle: ApplicationCommandSubCommandData = {
  name: 'shuffle',
  description: 'Shuffle items in a poll',

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
