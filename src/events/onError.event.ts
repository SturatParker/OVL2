import { ClientEventCallback } from 'src/common/types/ClientEventCallback.type';
import { ClientEventHandler } from '../common/types/ClientEventHandler.type';

const logError: ClientEventCallback<'error'> = async (
  error: Error
): Promise<void> => {
  console.error(error);
};

export const onError: ClientEventHandler<'error'> =
  new ClientEventHandler<'error'>('error', logError);
