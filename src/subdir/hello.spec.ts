import { world } from './hello';

describe('test world function', () => {
  it('should return void', (done: jest.DoneCallback) => {
    world()
      .then((result) => {
        expect(result).toEqual('Hello world');
        done();
      })
      .catch((err: string): void => {
        done.fail(err);
      });
  });
});
