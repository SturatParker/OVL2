import { Client, ClientEvents } from 'discord.js';
import { ClientEvent as ClientEventTypes } from './client-event.type';

export abstract class ClientEventHandler<E extends ClientEventTypes = any> {
  constructor(public readonly event: E) {}

  abstract execute(...args: ClientEvents[E]): Promise<void>;

  registerClient(client: Client): Client {
    return client.on<E>(this.event, (...args: ClientEvents[E]) =>
      this.execute(...args)
    );
  }
}
