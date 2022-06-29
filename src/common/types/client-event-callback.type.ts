import { ClientEvents } from 'discord.js';
import { ClientEvent } from './client-event.type';

export type ClientEventCallback<E extends ClientEvent> = (
  ...args: ClientEvents[E]
) => Promise<void>;
