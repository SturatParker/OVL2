import { Client } from 'discord.js';
import { ClientEventCallback } from './client-event-callback.type';
import { ClientEvent as ClientEventTypes } from './client-event.type';

export class ClientEventHandler<E extends ClientEventTypes = any> {
  constructor(
    public readonly event: E,
    public readonly callback: ClientEventCallback<E>
  ) {}

  registerClient(client: Client): Client {
    return client.on<E>(this.event, this.callback);
  }
}

type EXT = {
  [Event in ClientEventTypes]: ClientEventHandler<Event>;
};

export type Foo<E extends ClientEventTypes> = {
  [Event in E]: EXT[Event];
};
