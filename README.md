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

```
const { container } = require('yardic');
class Bar {}
class Baz {}

class Foo {
  constructor(bar, baz) {
    this.bar = bar;
    this.baz = baz;
  }
}
```
