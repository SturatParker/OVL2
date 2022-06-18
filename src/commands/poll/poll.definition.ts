import { ApplicationCommandSubGroupData } from 'discord.js';
import { close } from './definitions/close';
import { open } from './definitions/open';
import { random } from './definitions/random';
import { set } from './definitions/set';
import { shuffle } from './definitions/shuffle';
import { unset } from './definitions/unset';
import { winner } from './definitions/winner';

export const pollDefinition: ApplicationCommandSubGroupData = {
  name: 'poll',
  description: 'Poll',
  type: 'SUB_COMMAND_GROUP',
  options: [set, unset, open, close, shuffle, winner, random],
};
