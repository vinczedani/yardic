const { container } = require('..');
const Foo = require('./services/fooService');

function demo() {
  const fooInstance = container.get(Foo);
  const fooInstance2 = container.get(Foo);
  fooInstance.fooFunction();
}

demo();
