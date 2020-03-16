interface iClass<T> extends Function { new (...args: any[]): T; }

interface iServiceMetadata {
  type?: 'singleton' | 'factory',
}

interface iObject<T> {
  instance: T
}

interface iService<T> {
  Class: iClass<T>,
  dependencies: string[],
  metadata: iServiceMetadata,
  instance?: T
}

type descriptor<T> = string | iClass<T>;
type iStoreable<T> = iObject<T> | iService<T>;

function isService<T>(storeable: iStoreable<T>): storeable is iService<T> {
  const service = <iService<T>>storeable;
  return Array.isArray(service.dependencies) && service.Class && !!service.metadata;
}

export class Container {
  storage: Map<string, iStoreable<any>>;
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
      Class: ServiceClass,
      dependencies: dependencieStrings,
      metadata,
    } as iService<T>);
  }

  setObject<T>(name: string, object: T): void {
    this.storage.set(name, {
      instance: object,
    } as iObject<T>);
  }

  get<T>(descriptor: descriptor<T>): T {
    let name;
    if (typeof descriptor === 'string') {
      name = descriptor;
    } else if (typeof descriptor === 'function') {
      name = descriptor.name;
    } else {
      throw new Error('Invalid param provided for container.get.');
    }
    const service: iStoreable<T> | undefined = this.storage.get(name);

    if (!service) {
      throw new Error('Service not found!');
    }
    if (service.instance) {
      return service.instance;
    }
    if (!isService(service)) {
      throw new Error('Unexpected error');
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
