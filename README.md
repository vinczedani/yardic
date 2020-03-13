# Yardic
Yet AnotheR Dependency Injection Container

Zero dep DI container for Javascript and Typescript

![CI](https://github.com/vinczedani/yadic/workflows/CI/badge.svg)

# Install

Yadic can be installed through the node package manager

```sh
$ npm install yardic
```

# Usage
## Javascript
Register all your Javascript classes into a container

```javascript
const { container } = require('yardic');
class Bar {}
container.register(Bar);

class Fizz {}
container.register(Fizz, [], { type: "factory" });


class Foo {
  constructor(bar, fizz) {
    this.bar = bar;
    this.fizz = fizz;
  }
}
container.register(Foo, [Fizz, Bar]);

// somewhere in code
const fooInstance = container.get(Foo);
// it will create a singleton Bar, a new Fizz and a singleton Foo instance

// in another file
const fooInstanceAgain = container.get(Foo);
// it will return the already created Foo instance
const fizzInstance = container.get(Fizz);
// it will return a new Fizz

```
