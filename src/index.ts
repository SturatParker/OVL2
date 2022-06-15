import { hello, world } from 'src/subdir/hello';

hello();
world()
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
