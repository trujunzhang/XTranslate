// Helper to work with browser's local/session storage api

interface IStorageHelperOptions {
  addKeyPrefix?: boolean;
  useSession?: boolean; // use `sessionStorage` instead of `localStorage`
}

export function createStorage<T>(key: string, defaultValue?: T, options?: IStorageHelperOptions) {
  return new StorageHelper(key, defaultValue, options);
}

export class StorageHelper<T> {
  static keyPrefix = "";

  static defaultOptions: IStorageHelperOptions = {
    addKeyPrefix: true,
    useSession: false,
  }

  constructor(protected key: string, protected defaultValue?: T, protected options?: IStorageHelperOptions) {
    this.options = Object.assign({}, StorageHelper.defaultOptions, options);
    if (this.options.addKeyPrefix) {
      this.key = StorageHelper.keyPrefix + key;
    }
  }

  protected get storage() {
    if (this.options.useSession) return window.sessionStorage;
    return window.localStorage;
  }

  get() {
    var strValue = this.storage.getItem(this.key);
    if (strValue != null) {
      try {
        return JSON.parse(strValue);
      } catch (e) {
      }
    }
    return this.defaultValue;
  }

  set(value: T) {
    this.storage.setItem(this.key, JSON.stringify(value));
    return this;
  }

  merge(value: Partial<T>) {
    var currentValue = this.get();
    return this.set(Object.assign(currentValue, value));
  }

  clear() {
    this.storage.removeItem(this.key);
    return this;
  }

  restoreDefault() {
    return this.set(this.defaultValue);
  }
}
