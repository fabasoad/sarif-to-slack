import Column from './Column'
import Row from './Row'
import Cell from './Cell'

const HEADER_TOTAL: string = 'Total'

export type TableHeaders = {
  main: string,
  rows: string[],
  columns: string[],
}

export default class Table {
  private readonly header: string
  private readonly columns: Column[]
  private readonly rows: Row[]

  public constructor(
    headers: TableHeaders,
  ) {
    this.header = headers.main
    this.columns = Array.from(
      { length: headers.columns.length },
      (_: unknown, index: number): Column => new Column(headers.columns[index], headers.rows.length)
    )
    const headerWidth: number = Math.max(
      this.header.length,
      ...headers.rows.map((v: string): number => v.length),
      HEADER_TOTAL.length,
    )
    this.rows = Array.from(
      { length: headers.rows.length },
      (_: unknown, index: number): Row => new Row(headers.rows[index], headerWidth, headers.columns.length)
    )
  }

  public set(rowIndex: number, columnIndex: number, v: number): void {
    if (rowIndex >= 0 && rowIndex < this.rows.length && columnIndex >= 0 && columnIndex < this.columns.length) {
      const cell = new Cell(v)
      cell.setWidth(this.columns[columnIndex].header.length)
      this.columns[columnIndex].setCell(rowIndex, cell)
      this.rows[rowIndex].setCell(columnIndex, cell)
      // Update width of the last cell ("Total") of every row, so that it is shown
      // correctly in string representation
      const rowTotalWidth: number = Math.max(
        // Based on the sum of all total values
        this.rows.reduce((sum: number, r: Row): number => {
          sum += r.total
          return sum
        }, 0).toString().length,
        // Based on the width of "Total" header
        HEADER_TOTAL.length,
      )
      this.rows.forEach((r: Row): void => r.setTotalWidth(rowTotalWidth))
    }
  }

  public toString(): string {
    const rowsStr: string[] = []
    if (this.rows.length > 0 && this.columns.length > 0) {
      this.rows.forEach((row: Row): number => rowsStr.push(row.toString()))

      const rowSeparator: string = rowsStr[0].replace(/[^|]/g, '-')
      rowsStr.unshift(rowSeparator)
      rowsStr.push(rowSeparator)

      const rowTotal: string[] = []
      let sumTotal: number = 0
      for (const column of this.columns) {
        const total: number = column.total
        rowTotal.push(total.toString() + `${total.toString().length < column.width ? ' '.repeat(column.width - total.toString().length) : ''}`)
        sumTotal += total
      }
      const column1: string = HEADER_TOTAL + `${this.rows[0].headerWidth > HEADER_TOTAL.length ? ' '.repeat(this.rows[0].headerWidth - HEADER_TOTAL.length) : ''}`
      const columnLast: string = sumTotal + `${sumTotal.toString().length < HEADER_TOTAL.length ? ' '.repeat(HEADER_TOTAL.length - sumTotal.toString().length) : ''}`
      rowsStr.push(`|${column1}|${rowTotal.join('|')}|${columnLast}|`)

      // Insert first row with titles and second row with separator
      const rowTop: string[] = [
        this.header + (this.header.length < this.rows[0].headerWidth ? ' '.repeat(this.rows[0].headerWidth - this.header.length) : ''),
        this.columns
          .map((c: Column): string => `${c.header}${c.header.length < c.width ? ' '.repeat(c.width - c.header.length) : ''}`)
          .join('|'),
        HEADER_TOTAL + (HEADER_TOTAL.length < this.rows[0].totalWidth ? ' '.repeat(this.rows[0].totalWidth - HEADER_TOTAL.length) : '')
      ]
      rowsStr.unshift(`|${rowTop.join('|')}|`)
    }

    return rowsStr
      .join('\n')
      .replace(/[|]/g, ' | ')
  }
}
