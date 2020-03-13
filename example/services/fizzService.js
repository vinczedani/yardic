const { container } = require('../..');

class Fizz {
  constructor() {
    console.log('Fizz constructor');
  }
  fizzFunction() {
    console.log('Fizz function');
  }
}
container.register(Fizz, [], { type: "factory" });

module.exports = Fizz;
