import { ApplicationCommandSubCommandData } from 'discord.js';

export const set: ApplicationCommandSubCommandData = {
  name: 'set',
  description: 'Set a poll',

  type: 'SUB_COMMAND',
  options: [
    {
      name: 'channel',
      description: 'Channel',
      type: 'CHANNEL',
      required: true,
    },
    {
      name: 'max_votes',
      description: 'Maximum number of votes each member may cast in this poll',
      type: 'INTEGER',
      required: true,
    },
    {
      name: 'max_self_votes',
      description:
        'Maximum number of votes each member may cast for their own submissions in this poll',
      type: 'INTEGER',
      required: true,
    },
  ],
};
