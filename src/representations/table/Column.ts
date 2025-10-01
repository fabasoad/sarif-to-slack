import type Cell from './Cell'
import Logger from '../../Logger'

export default class Column {
  private readonly _logger: Logger = new Logger('Column');
  private readonly _cells: Cell[];

  public constructor(
    public readonly header: string,
    cellsCount: number,
  ) {
    this._cells = new Array<Cell>(cellsCount)
  }

  public get total(): number {
    return this._cells
      .reduce((sum: number, c: Cell): number => {
        sum += Number(c.value)
        return sum
      }, 0)
  }

  public get width(): number {
    return Math.max(
      ...this._cells.map((c: Cell): number => c.getWidth()),
      this.total.toString().length
    )
  }

  public setCell(index: number, value: Cell): void {
    if (index >= 0 && index < this._cells.length) {
      this._cells[index] = value
      const width: number = this.width
      this._cells.forEach((c: Cell): void => c.setWidth(width))
    } else {
      this._logger.warn(`Cell index out of range. Requested index: ${index}. Cells count: ${this._cells.length}.`)
    }
  }
}
