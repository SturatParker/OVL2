import { ClientEventCallback } from 'src/common/types/ClientEventCallback.type';
import { ClientEventHandler } from '../common/types/ClientEventHandler.type';

const logError: ClientEventCallback<'error'> = (error: Error): void => {
  console.error(error);
};

export const onError: ClientEventHandler<'error'> =
  new ClientEventHandler<'error'>('error', logError);
