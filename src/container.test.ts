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
  it('returns the same instace of a singleton', () => {
    const container = new Container();
    container.register(Foo);

    const firstResult = container.get('Foo');
    const secondResult = container.get(Foo);

    expect(firstResult).toEqual(secondResult);
  });

  it('returns Foo with the same Fizz', () => {
    const container = new Container();
    container.register(Foo, ['Fizz', 'Bar'], { type: 'factory' });
    container.register(Fizz);
    container.register(Bar);

    const firstFoo: Foo = container.get('Foo');
    const secondFoo: Foo = container.get('Foo');

    expect(firstFoo).not.toBe(secondFoo);
    expect(firstFoo.fizz).toBe(secondFoo.fizz);
  });

  it('returns Foo with the same Fizz even if Fizz is registered as a class', () => {
    const container = new Container();
    container.register(Foo, [Fizz, 'Bar'], { type: 'factory' });
    container.register(Fizz);
    container.register(Bar);

    const firstFoo: Foo = container.get('Foo');
    const secondFoo: Foo = container.get('Foo');

    expect(firstFoo).not.toBe(secondFoo);
    expect(firstFoo.fizz).toBe(secondFoo.fizz);
  });

  it('returns Foo with the same multiple dependencies', () => {
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

  it('throws error if invalid data type is given as a dependency', () => {
    expect(() => {
      const container = new Container();
      container.register(Foo, [{ invalid: 'type' } as any]);
    }).toThrowError(new Error('Invalid dependency type: object'));
  });
});
