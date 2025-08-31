export default class Cell {
  private _width: number

  public constructor(private _value: number = 0) {
    this._width = _value.toString().length
  }

  public setWidth(width: number): void {
    this._width = width > this._width ? width : this._width
  }

  public getWidth(): number {
    return this._width
  }

  public get value(): number {
    return this._value
  }

  public toString(): string {
    const str: string = this._value.toString()
    const repeatCount: number = this._width - str.length
    return `${str}${repeatCount > 0 ? ' '.repeat(repeatCount) : ''}`
  }
}
