interface iClass<T> extends Function { new (...args: any[]): T; }

interface iServiceMetadata {
  type?: 'singleton' | 'factory',
}

interface iService<T> {
  name: string,
  Class: iClass<T>,
  dependencies: string[],
  metadata: iServiceMetadata,
  instance?: T
}

type descriptor<T> = string | iClass<T>;

export class Container {
  storage: Map<string, iService<any>>;
  constructor() {
    this.storage = new Map();
  }

  register<T>(ServiceClass: iClass<T>, dependencies: descriptor<T>[] = [], metadata: iServiceMetadata = {}): void {
    const dependencieStrings: string[] = dependencies.map((dep) => {
      if (typeof dep === 'string') return dep;
      if (typeof dep === 'function') return dep.name;
      throw new Error(`Invalid dependency type: ${typeof dep}`);
    });
    this.storage.set(ServiceClass.name, {
      name: ServiceClass.name,
      Class: ServiceClass,
      dependencies: dependencieStrings,
      metadata,
    });
  }

  get<T>(descriptor: descriptor<T>): T {
    let name;
    if (typeof descriptor === 'string') {
      name = descriptor;
    } else if (typeof descriptor === 'function') {
      name = descriptor.name;
    } else {
      throw new Error('Invalid param provided for get.');
    }
    const service: iService<T> | undefined = this.storage.get(name);

    if (!service) {
      throw new Error('Service not found!');
    }
    if (service.metadata.type !== 'factory' && service.instance) {
      return service.instance;
    }

    const deps = service.dependencies.map(depName => this.get(depName));
    if (service.metadata.type === 'factory') {
      return new service.Class(...deps);
    }
    const instance = new service.Class(...deps);
    this.storage.set(name, {
      ...service,
      instance,
    });
    return instance;
  }
}

export const container = new Container();
