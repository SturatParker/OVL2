import { ApplicationCommandSubCommandData } from 'discord.js';

export const unset: ApplicationCommandSubCommandData = {
  name: 'unset',
  description: 'Unset a poll',

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
