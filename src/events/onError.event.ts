import { ClientEventCallback } from 'src/common/types/ClientEventCallback.type';
import { ClientEventHandler } from '../common/types/ClientEventHandler.type';

const logError: ClientEventCallback<'error'> = (
  error: Error
): Promise<void> => {
  console.error(error);
  return new Promise((resolve) => resolve());
};

export const onError: ClientEventHandler<'error'> =
  new ClientEventHandler<'error'>('error', logError);
