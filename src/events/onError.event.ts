import { ClientEventCallback } from 'src/common/types/client-event-callback.type';
import { ClientEventHandler } from '../common/types/client-event-handler.type';

const logError: ClientEventCallback<'error'> = (
  error: Error
): Promise<void> => {
  console.error(error);
  return new Promise((resolve) => resolve());
};

export const onError: ClientEventHandler<'error'> =
  new ClientEventHandler<'error'>('error', logError);
