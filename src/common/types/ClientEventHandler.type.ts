import { ClientEvent } from './ClientEvent.type';
import { ClientEventCallback } from './ClientEventCallback.type';

export class ClientEventHandler<E extends ClientEvent> {
  constructor(
    public readonly event: E,
    public readonly callback: ClientEventCallback<E>
  ) {}
}
