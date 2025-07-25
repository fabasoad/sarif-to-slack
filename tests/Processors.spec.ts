import * as fs from 'fs'
import * as path from 'path'
import { processColor, processSarifPath } from '../src/Processors'

jest.mock('fs')
const mockedFs = fs as jest.Mocked<typeof fs>

jest.mock('../src/Logger', () => ({
  __esModule: true,
  default: { info: jest.fn(), debug: jest.fn() }
}))

describe('(unit): processColor', () => {
  test('returns correct hex for success', () => {
    expect(processColor('success')).toBe('#008000')
  })

  test('returns correct hex for failure', () => {
    expect(processColor('failure')).toBe('#ff0000')
  })

  test('returns correct hex for cancelled', () => {
    expect(processColor('cancelled')).toBe('#0047ab')
  })

  test('returns correct hex for skipped', () => {
    expect(processColor('skipped')).toBe('#808080')
  })

  test('returns input for unknown color', () => {
    expect(processColor('other')).toBe('other')
  })

  test('returns undefined for undefined input', () => {
    expect(processColor(undefined)).toBeUndefined()
  })
})

describe('(unit): processSarifPath', () => {
  const fakeDir = '/fake/dir'
  const fakeFile = '/fake/file.sarif'

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('throws if path does not exist', () => {
    mockedFs.existsSync.mockReturnValue(false)
    expect(() => processSarifPath(fakeFile)).toThrow(/does not exist/)
  })

  test('returns .sarif files in directory', () => {
    mockedFs.existsSync.mockReturnValue(true)
    mockedFs.statSync.mockReturnValue({ isDirectory: () => true, isFile: () => false } as any)
    // @ts-ignore: mocking readdirSync with a specific return value
    mockedFs.readdirSync.mockReturnValue(['a.sarif', 'b.SARIF', 'c.txt'])
    const result: string[] = processSarifPath(fakeDir)
    expect(result).toEqual(
      ['a.sarif', 'b.SARIF'].map((file: string) => path.join(fakeDir, file))
    )
  })

  test('returns file path if it is a file', () => {
    mockedFs.existsSync.mockReturnValue(true)
    mockedFs.statSync.mockReturnValue({ isDirectory: () => false, isFile: () => true } as any)
    const result: string[] = processSarifPath(fakeFile)
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual(fakeFile)
  })

  test('throws if path is neither file nor directory', () => {
    mockedFs.existsSync.mockReturnValue(true)
    mockedFs.statSync.mockReturnValue({ isDirectory: () => false, isFile: () => false } as any)
    expect(() => processSarifPath('/weird/path')).toThrow(/neither a file nor a directory/)
  })
})
