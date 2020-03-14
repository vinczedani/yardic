const { container } = require('../..');
const Fizz = require('./fizzService');
const Bar = require('./barService');

class Foo {
  constructor(fizz, bar) {
    this.fizz = fizz;
    this.bar = bar;
    console.log('Foo constructor');
  }
  fooFunction() {
    console.log('Hello world!');
  }
}
container.register(Foo, [Fizz, Bar]);

module.exports = Foo;