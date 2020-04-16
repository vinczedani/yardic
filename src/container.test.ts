import { Container } from './container';

class Fizz {}

class Bar {}

class Foo {
  fizz: Fizz;
  bar: Bar;

  constructor(fizz: Fizz, bar: Bar) {
    this.fizz = fizz;
    this.bar = bar;
  }
}

describe('container', () => {
  it('should return the same instace of a singleton', () => {
    const container = new Container();
    container.register(Foo);

    const firstResult = container.get('Foo');
    const secondResult = container.get(Foo);

    expect(firstResult).toEqual(secondResult);
  });

  it('should return Foo with the same Fizz', () => {
    const container = new Container();
    container.register(Foo, ['Fizz', 'Bar'], { type: 'factory' });
    container.register(Fizz);
    container.register(Bar);

    const firstFoo: Foo = container.get('Foo');
    const secondFoo: Foo = container.get('Foo');

    expect(firstFoo).not.toBe(secondFoo);
    expect(firstFoo.fizz).toBe(secondFoo.fizz);
  });

  it('should return Foo with the same Fizz even if Fizz is registered as a class', () => {
    const container = new Container();
    container.register(Foo, [Fizz, 'Bar'], { type: 'factory' });
    container.register(Fizz);
    container.register(Bar);

    const firstFoo: Foo = container.get('Foo');
    const secondFoo: Foo = container.get('Foo');

    expect(firstFoo).not.toBe(secondFoo);
    expect(firstFoo.fizz).toBe(secondFoo.fizz);
  });

  it('should return Foo with the same multiple dependencies', () => {
    const container = new Container();
    container.register(Foo, ['Fizz', 'Bar'], { type: 'factory' });
    container.register(Bar);
    container.register(Fizz);

    const firstFoo: Foo = container.get('Foo');
    const secondFoo: Foo = container.get('Foo');

    expect(firstFoo).not.toBe(secondFoo);
    expect(firstFoo.fizz).toBe(secondFoo.fizz);
    expect(firstFoo.bar).toBe(secondFoo.bar);
  });

  it('should throw error if invalid data type is given as a dependency', () => {
    expect(() => {
      const container = new Container();
      container.register(Foo, [{ invalid: 'type' } as any]);
    }).toThrowError(new Error('Invalid dependency type: object'));
  });

  it('should be able to set object', () => {
    const container = new Container();
    const testObject = {
      randomFunction() {}
    }
    const name = 'test';
    container.setValue(name, testObject);

    const objectFromContainer = container.get(name);

    expect(objectFromContainer).toBe(testObject);
  });

  it('should be able to set anything with setValue', () => {
    const container = new Container();
    const testString = 'secret'
    const name = 'test';
    container.setValue(name, testString);

    const objectFromContainer = container.get(name);

    expect(objectFromContainer).toBe(testString);
  });

  it('should overwrite classes if same name is set', () => {
    const container = new Container();
    container.register(Fizz);
    const fizzInstance = container.get(Fizz);

    expect(fizzInstance instanceof Fizz).toBe(true);

    const testObject = {
      randomFunction() {}
    }
    container.setValue('Fizz', testObject);

    const objectFromContainer = container.get(Fizz);

    expect(objectFromContainer).toBe(testObject);
    expect(objectFromContainer instanceof Fizz).toBe(false);
  });

  it('should return a new instance, even for non factory services', () => {
    const container = new Container();
    container.register(Fizz);
    const fizzInstance = container.getNew(Fizz);
    const fizzInstance2 = container.getNew(Fizz);

    expect(fizzInstance instanceof Fizz).toBe(true);
    expect(fizzInstance).not.toBe(fizzInstance2);
  });

  it('should return deepCopied values as dependecies set by setValue() when using getNew', () => {
    const container = new Container();
    class TestClassWithConfig {
      config: object;
      constructor(config: object) {
        this.config = config;
      }
    }
    container.register(TestClassWithConfig, ['config']);
    container.setValue('config', { some: 'testConfig' });

    const instance = container.getNew(TestClassWithConfig);
    const instance2 = container.getNew(TestClassWithConfig);

    expect(instance.config).not.toBe(instance2.config);
  });
});
