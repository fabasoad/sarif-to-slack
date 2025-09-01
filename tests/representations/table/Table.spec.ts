import Table from '../../../src/representations/table/Table'

describe('(unit): Table', (): void => {
  test.each([
    [['row1'], []],
    [[], ['column1']],
    [[], []]
  ])('should not fail with %s and %s', (rows: string[], columns: string[]): void => {
    const table = new Table({ rows, columns })
    const testValue: number = 12
    expect((): void => table.set(0, 0, testValue)).not.toThrow()
    expect((): void => table.set(-1, 0, testValue)).not.toThrow()
    expect((): void => table.set(0, -1, testValue)).not.toThrow()
    expect(table.toString()).toEqual('')
  })

  test('should prepare string correctly when "Total" is longer', (): void => {
    const table = new Table({
      rows: ['a', 'abc', 'ab'],
      columns: ['x', 'xyz', 'xy']
    })
    table.set(0, 0, 1)
    table.set(0, 1, 1)
    table.set(0, 2, 1)
    table.set(1, 0, 1)
    table.set(2, 0, 1)
    table.set(1, 1, 1)
    table.set(2, 1, 1)
    table.set(1, 2, 1)
    table.set(2, 2, 1)
    expect(table.toString()).toEqual(` |       | x | xyz | xy | Total | 
 | ----- | - | --- | -- | ----- | 
 | a     | 1 | 1   | 1  | 3     | 
 | abc   | 1 | 1   | 1  | 3     | 
 | ab    | 1 | 1   | 1  | 3     | 
 | ----- | - | --- | -- | ----- | 
 | Total | 3 | 3   | 3  | 9     | `)
  })

  test('should prepare string correctly when "Total" is shorter', (): void => {
    const table = new Table({
      rows: ['a', 'abcdef', 'ab'],
      columns: ['x', 'xyz', 'xy']
    })
    table.set(0, 0, 1)
    table.set(0, 1, 1)
    table.set(0, 2, 99998)
    table.set(1, 0, 1)
    table.set(2, 0, 1)
    table.set(1, 1, 1)
    table.set(2, 1, 1)
    table.set(1, 2, 1)
    table.set(2, 2, 1)
    expect(table.toString()).toEqual(` |        | x | xyz | xy     | Total  | 
 | ------ | - | --- | ------ | ------ | 
 | a      | 1 | 1   | 99998  | 100000 | 
 | abcdef | 1 | 1   | 1      | 3      | 
 | ab     | 1 | 1   | 1      | 3      | 
 | ------ | - | --- | ------ | ------ | 
 | Total  | 3 | 3   | 100000 | 100006 | `)
  })

  test('should prepare string correctly when rows less than columns', (): void => {
    const table = new Table({
      rows: ['a'],
      columns: ['x', 'xyz', 'xy']
    })
    table.set(0, 0, 1)
    table.set(0, 1, 1)
    table.set(0, 2, 99998)
    expect(table.toString()).toEqual(` |       | x | xyz | xy    | Total  | 
 | ----- | - | --- | ----- | ------ | 
 | a     | 1 | 1   | 99998 | 100000 | 
 | ----- | - | --- | ----- | ------ | 
 | Total | 1 | 1   | 99998 | 100000 | `)
  })

  test('should prepare string correctly when rows more than columns', (): void => {
    const table = new Table({
      rows: ['a', 'abcdef', 'ab'],
      columns: ['x']
    })
    table.set(0, 0, 35000)
    table.set(1, 0, 35000)
    table.set(2, 0, 30000)
    expect(table.toString()).toEqual(` |        | x      | Total  | 
 | ------ | ------ | ------ | 
 | a      | 35000  | 35000  | 
 | abcdef | 35000  | 35000  | 
 | ab     | 30000  | 30000  | 
 | ------ | ------ | ------ | 
 | Total  | 100000 | 100000 | `)
  })

  test('should prepare string correctly when row and column headers are short', (): void => {
    const table = new Table({
      rows: ['a', 'b', 'c'],
      columns: ['x']
    })
    table.set(0, 0, 35000)
    table.set(1, 0, 64999)
    table.set(2, 0, 1)
    expect(table.toString()).toEqual(` |       | x      | Total  | 
 | ----- | ------ | ------ | 
 | a     | 35000  | 35000  | 
 | b     | 64999  | 64999  | 
 | c     | 1      | 1      | 
 | ----- | ------ | ------ | 
 | Total | 100000 | 100000 | `)
  })

  test('should prepare string correctly when row and column headers are numbers', (): void => {
    const table = new Table({
      rows: ['1'],
      columns: ['1']
    })
    table.set(0, 0, 1)
    expect(table.toString()).toEqual(` |       | 1 | Total | 
 | ----- | - | ----- | 
 | 1     | 1 | 1     | 
 | ----- | - | ----- | 
 | Total | 1 | 1     | `)
  })
})
