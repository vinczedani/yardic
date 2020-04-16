const { container } = require('../..');
const Fizz = require('./fizzService');
const Bar = require('./barService');

class Foo {
  constructor(fizz, bar, config) {
    this.fizz = fizz;
    this.bar = bar;
    console.log('Foo constructor');
    console.log(config);
  }
  fooFunction() {
    console.log('Hello world!');
  }
}
container.register(Foo, [Fizz, Bar, 'config']);

module.exports = Foo;
