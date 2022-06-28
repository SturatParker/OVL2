import { ClientEventHandler } from '../common/types/client-event-handler.type';

export class ErrorHandler extends ClientEventHandler<'error'> {
  constructor() {
    super('error');
  }

  execute(error: Error): Promise<void> {
    console.error(error);
    return new Promise((resolve) => resolve());
  }
}

export const onError = new ErrorHandler();
