import Cell from './Cell'
import Logger from '../../Logger'

export default class Row {
  private readonly _cells: Cell[]
  private _totalWidth: number

  public constructor(
    private readonly _header: string,
    public readonly headerWidth: number,
    cellsCount: number,
  ) {
    this._cells = Array.from({ length: cellsCount }, (): Cell => new Cell())
    this._totalWidth = 1
  }

  public get total(): number {
    return this._cells
      .reduce((sum: number, c: Cell): number => {
        sum += Number(c.value)
        return sum
      }, 0)
  }

  public setCell(index: number, value: Cell): void {
    if (index >= 0 && index < this._cells.length) {
      this._cells[index] = value
    } else {
      Logger.warn(`Setting cell failed. Reason: index out of range. Requested index: ${index}. Cells count: ${this._cells.length}.`)
    }
  }

  public getTotalWidth(): number {
    return this._totalWidth
  }

  public setTotalWidth(value: number): void {
    this._totalWidth = value
  }

  public toString(): string {
    const result: string[] = []
    result.push(this._header + `${this.headerWidth > this._header.length ? ' '.repeat(this.headerWidth - this._header.length) : ''}`)
    this._cells.map((c: Cell): string => c.toString()).forEach((v: string): number => result.push(v))
    const totalStr: string = this.total.toString();
    result.push(totalStr + `${this._totalWidth > totalStr.length ? ' '.repeat(this._totalWidth - totalStr.length) : ''}`)
    return `|${result.join('|')}|`
  }
}
