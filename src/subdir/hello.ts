import { EventEmitter } from 'events';

export function hello(): void {
  const emitter = new EventEmitter();

  console.log('Hello world');

  emitter.on('foo', (val) => {
    console.log(val);
  });

  let i = 0;
  setInterval(() => {
    emitter.emit('foo', i++);
  }, 1000);

  return;
}

export async function world(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Hello world');
    }, 1000);
  });
}
