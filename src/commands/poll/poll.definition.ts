import { ApplicationCommandSubGroupData } from 'discord.js';
import { close } from './close/close';
import { open } from './open/open';
import { random } from './random/random';
import { set } from './set/set.definition';
import { shuffle } from './shuffle/shuffle';
import { unset } from './unset/unset';
import { winner } from './winner/winner';

export const pollDefinition: ApplicationCommandSubGroupData = {
  name: 'poll',
  description: 'Poll',
  type: 'SUB_COMMAND_GROUP',
  options: [set, unset, open, close, shuffle, winner, random],
};
