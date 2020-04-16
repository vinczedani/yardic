# Yardic
Yet AnotheR Dependency Injection Container

Zero dep DI container for Javascript and Typescript

![CI](https://github.com/vinczedani/yardic/workflows/CI/badge.svg)

# Install

Yadic can be installed through the node package manager

```sh
$ npm install yardic
```

# Usage
## Javascript
Register all your Javascript classes into a container and use `container.get(Class);` anywhere in your code to get instance of a registered class. You can also use `container.get(ClassName);` where ClassName is the name of your class, like 'FooService', but it is recommended to use the Class itself. The reason behind this, is that if you require the class, the module you define the class in is guaranteed to be required, resulting in the module to be registered before requesting it.

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

To set constant values, you can use `container.setValue('name', { secretStuff: 'mysecretApiKey' });` This lets you register a non class object if needed.

```javascript
const { container } = require('yardic');

class Foo {
  constructor(config) {
    this.someconfigvalue = config.foodata;
  }
}
container.register(Foo, ['config']);
container.setValue('config', {
  foodata: { key: 'asd', secret: 'asd' },
});
```

## Testing

During testing, it might be useful to overwrite some of the services inside the container with mock objects. To be able to test isolated, it is recomended to modify a cloned version of your container.

Another useful feature during testing is to enforce a new instance, even for non `factory` (singleton) services. This lets you create new instances for every class, so your tests can be fully independent.


```javascript
// foo.js
const { container } = require('yardic');
class Foo {
  constructor(bar) {
    this.bar = bar;
  }
}
container.register(Foo, [Bar]);

// foo.test.js
const { container } = require('yardic');

const testContaier = container.clone();
testContaier.setValue('Bar', mockBarObject);
// ...
  const fooUnderTest = testContainer.getNew('Foo');
// ...
  const anotherFooUnderTest = testContainer.getNew('Foo');
  // the instances will be different, even if Foo is defined as a singleton
// ...
```

If needed, you can also require the Container class, and create multiple instances.
```javascript
const { Container } = require('yardic');
const container1 = new Container();
const container2 = new Container();
// ...
```

## Typescript

When using yardic with typescript, it will work mostly the same as if you were using it with javascript. If you use .get with classes, as recommended. The return value will hold the correct type.

```typescript
// foo.ts
import { container } from 'yardic';
class Foo {
  //...
}
container.register(Foo);

// anywhere in code:
//...
const foo = container.get(Foo); // foo will hold the type Foo
const foo2: Foo = container.get('Foo'); // when using name strings to get the service, you need to tell the type
```
