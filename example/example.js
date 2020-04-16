const { container } = require('..');
const Foo = require('./services/fooService');
const Fizz = require('./services/fizzService');

container.setValue('config', 'configuration value');

function demo() {
  const fooInstance = container.get(Foo);
  const fooInstance2 = container.get(Foo);
  fooInstance.fooFunction();

  const fizzInstance = container.get(Fizz);
  fizzInstance.fizzFunction();
}

demo();

/*
 This will output the following:

Fizz constructor
Bar constructor
Foo constructor
some value
Hello world!
Fizz constructor
Fizz function

*/
