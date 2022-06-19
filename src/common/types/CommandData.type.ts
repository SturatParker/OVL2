import {
  ApplicationCommandSubCommandData,
  ApplicationCommandSubGroupData,
} from 'discord.js';

export type CommandData =
  | ApplicationCommandSubGroupData
  | ApplicationCommandSubCommandData;
