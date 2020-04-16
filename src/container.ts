interface iClass<T> extends Function { new (...args: any[]): T }

interface iServiceMetadata {
  type?: 'singleton' | 'factory';
}

interface iObject<T> {
  instance: T;
}

interface iService<T> {
  Class: iClass<T>;
  dependencies: string[];
  metadata: iServiceMetadata;
  instance?: T;
}

type descriptor<T> = string | iClass<T>;
type iStoreable<T> = iObject<T> | iService<T>;

function isService<T>(storeable: iStoreable<T>): storeable is iService<T> {
  const service = storeable as iService<T>;
  return Array.isArray(service.dependencies) && service.Class && !!service.metadata;
}

function getNameFromDescriptor<T>(descriptor: descriptor<T>): string {
  if (typeof descriptor === 'string') {
    return descriptor;
  }
  if (typeof descriptor === 'function') {
    return descriptor.name;
  }
  throw new Error('Invalid param provided for container.get.');
}

export class Container {
  storage: Map<string, iStoreable<any>>;
  constructor(map = new Map()) {
    this.storage = map;
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

  setValue<T>(name: string, object: T): void {
    this.storage.set(name, {
      instance: object,
    } as iObject<T>);
  }

  clone(): Container {
    return new Container(new Map(this.storage));
  }

  getNew<T>(descriptor: descriptor<T>): T {
    const name = getNameFromDescriptor(descriptor);

    const service: iStoreable<T> | undefined = this.storage.get(name);

    if (!service) {
      throw new Error('Service not found!');
    }
    if (!(service as iService<T>).Class && service.instance) {
      return JSON.parse(JSON.stringify(service.instance));
    }
    if (!isService(service)) {
      throw new Error('Unexpected error');
    }


    const deps = service.dependencies.map(depName => this.getNew(depName));
    return new service.Class(...deps);
  }

  get<T>(descriptor: descriptor<T>): T {
    const name = getNameFromDescriptor(descriptor);

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
