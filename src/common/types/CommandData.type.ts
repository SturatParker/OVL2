import {
  ApplicationCommandData,
  ApplicationCommandSubCommandData,
  ApplicationCommandSubGroupData,
} from 'discord.js';

export type CommandData =
  | ApplicationCommandData
  | ApplicationCommandSubGroupData
  | ApplicationCommandSubCommandData;
