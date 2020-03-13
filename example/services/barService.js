const { container } = require('../..');

class Bar {
  constructor() {
    console.log('Bar constructor');
  }
  fizzFunction() {
    console.log('Bar function');
  }
}
container.register(Bar);

module.exports = Bar;
