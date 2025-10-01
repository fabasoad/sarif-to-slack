import Table from '../../../src/representations/table/Table';
import { randomAlphabetic } from '../../../src/utils/StringUtils';

describe('(unit): Table', (): void => {
  describe('toString()', (): void => {
    const TOTAL_HEADER = 'Total';

    test.each([
      [4, TOTAL_HEADER.length, 6],
      [3, TOTAL_HEADER.length, 4],
      [6, TOTAL_HEADER.length, 7],
      [4, TOTAL_HEADER.length, 3],
      [7, TOTAL_HEADER.length, 6],
      [6, TOTAL_HEADER.length, 4],
    ])('should pass when header=%s, total=%s and row=%s', (h: number, t: number, r: number): void => {
      const expectedSize: number = Math.max(h, t, r);

      const fill = (v: string, s: number, c: string = ' '): string => {
        return v + (
          v.length < s ? c.repeat(s - v.length) : ''
        );
      }

      const main: string = randomAlphabetic(h);
      const row: string = randomAlphabetic(r);
      const column: string = randomAlphabetic(1);

      const table = new Table({ main, columns: [column], rows: [row] });
      table.set(0, 0, 1);
      expect(table.toString()).toEqual(` | ${fill(main, expectedSize)} | ${column} | Total | 
 | ${fill('-', expectedSize, '-')} | - | ----- | 
 | ${fill(row, expectedSize)} | 1 | 1     | 
 | ${fill('-', expectedSize, '-')} | - | ----- | 
 | ${fill(TOTAL_HEADER, expectedSize)} | 1 | 1     | `);
    });

    test.each(
      [[0, 1], [1, 0], [0, 0]]
    )('should pass when rows size is %s and columns size is %s', (r: number, c: number): void => {
      const table = new Table({
        columns: Array.from({ length: c }, (): string => randomAlphabetic(1)),
        rows: Array.from({ length: r }, (): string => randomAlphabetic(1)),
      });
      for (let i: number = 0; i < r; i++) {
        for (let j: number = 0; j < c; j++) {
          table.set(i, j, 1);
        }
      }
      expect(table.toString()).toEqual('');
    });
  })

 //  test('should prepare string correctly when "Total" is longer', (): void => {
 //    const table = new Table({
 //      rows: ['a', 'abc', 'ab'],
 //      columns: ['x', 'xyz', 'xy']
 //    })
 //    table.set(0, 0, 1)
 //    table.set(0, 1, 1)
 //    table.set(0, 2, 1)
 //    table.set(1, 0, 1)
 //    table.set(2, 0, 1)
 //    table.set(1, 1, 1)
 //    table.set(2, 1, 1)
 //    table.set(1, 2, 1)
 //    table.set(2, 2, 1)
 //    expect(table.toString()).toEqual(` |       | x | xyz | xy | Total |
 // | ----- | - | --- | -- | ----- |
 // | a     | 1 | 1   | 1  | 3     |
 // | abc   | 1 | 1   | 1  | 3     |
 // | ab    | 1 | 1   | 1  | 3     |
 // | ----- | - | --- | -- | ----- |
 // | Total | 3 | 3   | 3  | 9     | `)
 //  })
 //
 //  test('should prepare string correctly when "Total" is shorter', (): void => {
 //    const table = new Table({
 //      rows: ['a', 'abcdef', 'ab'],
 //      columns: ['x', 'xyz', 'xy']
 //    })
 //    table.set(0, 0, 1)
 //    table.set(0, 1, 1)
 //    table.set(0, 2, 99998)
 //    table.set(1, 0, 1)
 //    table.set(2, 0, 1)
 //    table.set(1, 1, 1)
 //    table.set(2, 1, 1)
 //    table.set(1, 2, 1)
 //    table.set(2, 2, 1)
 //    expect(table.toString()).toEqual(` |        | x | xyz | xy     | Total  |
 // | ------ | - | --- | ------ | ------ |
 // | a      | 1 | 1   | 99998  | 100000 |
 // | abcdef | 1 | 1   | 1      | 3      |
 // | ab     | 1 | 1   | 1      | 3      |
 // | ------ | - | --- | ------ | ------ |
 // | Total  | 3 | 3   | 100000 | 100006 | `)
 //  })
 //
 //  test('should prepare string correctly when rows less than columns', (): void => {
 //    const table = new Table({
 //      rows: ['a'],
 //      columns: ['x', 'xyz', 'xy']
 //    })
 //    table.set(0, 0, 1)
 //    table.set(0, 1, 1)
 //    table.set(0, 2, 99998)
 //    expect(table.toString()).toEqual(` |       | x | xyz | xy    | Total  |
 // | ----- | - | --- | ----- | ------ |
 // | a     | 1 | 1   | 99998 | 100000 |
 // | ----- | - | --- | ----- | ------ |
 // | Total | 1 | 1   | 99998 | 100000 | `)
 //  })
 //
 //  test('should prepare string correctly when rows more than columns', (): void => {
 //    const table = new Table({
 //      rows: ['a', 'abcdef', 'ab'],
 //      columns: ['x']
 //    })
 //    table.set(0, 0, 35000)
 //    table.set(1, 0, 35000)
 //    table.set(2, 0, 30000)
 //    expect(table.toString()).toEqual(` |        | x      | Total  |
 // | ------ | ------ | ------ |
 // | a      | 35000  | 35000  |
 // | abcdef | 35000  | 35000  |
 // | ab     | 30000  | 30000  |
 // | ------ | ------ | ------ |
 // | Total  | 100000 | 100000 | `)
 //  })
 //
 //  test('should prepare string correctly when row and column headers are short', (): void => {
 //    const table = new Table({
 //      rows: ['a', 'b', 'c'],
 //      columns: ['x']
 //    })
 //    table.set(0, 0, 35000)
 //    table.set(1, 0, 64999)
 //    table.set(2, 0, 1)
 //    expect(table.toString()).toEqual(` |       | x      | Total  |
 // | ----- | ------ | ------ |
 // | a     | 35000  | 35000  |
 // | b     | 64999  | 64999  |
 // | c     | 1      | 1      |
 // | ----- | ------ | ------ |
 // | Total | 100000 | 100000 | `)
 //  })
 //
 //  test('should prepare string correctly when row and column headers are numbers', (): void => {
 //    const table = new Table({
 //      rows: ['1'],
 //      columns: ['1']
 //    })
 //    table.set(0, 0, 1)
 //    expect(table.toString()).toEqual(` |       | 1 | Total |
 // | ----- | - | ----- |
 // | 1     | 1 | 1     |
 // | ----- | - | ----- |
 // | Total | 1 | 1     | `)
 //  })
 //
 //  test('should prepare string correctly when main header is longer than "Total"', (): void => {
 //    const table = new Table({
 //      main: 'abz',
 //      rows: ['1'],
 //      columns: ['1']
 //    })
 //    table.set(0, 0, 1)
 //    expect(table.toString()).toEqual(` |       | 1 | Total |
 // | ----- | - | ----- |
 // | 1     | 1 | 1     |
 // | ----- | - | ----- |
 // | Total | 1 | 1     | `)
 //  })
})
