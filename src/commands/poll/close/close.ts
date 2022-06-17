import { ApplicationCommandSubCommandData } from 'discord.js';

export const close: ApplicationCommandSubCommandData = {
  name: 'close',
  description: 'Suspend voting in a poll',

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
