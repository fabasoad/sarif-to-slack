/**
 * This class is an extension for the {@link Array} class. It adds some additional
 * useful methods.
 * @internal
 */
export default class ExtendedArray<T> extends Array<T> {

  public findByProperty<K extends keyof T>(prop: K, value: T[K]): T | undefined {
    return this.find((v: T): boolean => v[prop] === value)
  }
}
