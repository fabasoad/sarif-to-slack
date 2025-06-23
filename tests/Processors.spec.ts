import * as fs from 'fs'
import * as path from 'path'
import { processColor, processSarifPath, processLogLevel } from '../src/Processors'

jest.mock('fs')
const mockedFs = fs as jest.Mocked<typeof fs>

jest.mock('../src/Logger', () => ({
  __esModule: true,
  default: { info: jest.fn(), debug: jest.fn() }
}))

describe('processColor', () => {
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

describe('processSarifPath', () => {
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

describe('processLogLevel', () => {
  test('returns 0 for silly', () => {
    expect(processLogLevel('silly')).toBe(0)
  })

  test('returns 1 for trace', () => {
    expect(processLogLevel('trace')).toBe(1)
  })

  test('returns 2 for debug', () => {
    expect(processLogLevel('debug')).toBe(2)
  })

  test('returns 3 for info', () => {
    expect(processLogLevel('info')).toBe(3)
  })

  test('returns 4 for warning', () => {
    expect(processLogLevel('warning')).toBe(4)
  })

  test('returns 5 for error', () => {
    expect(processLogLevel('error')).toBe(5)
  })

  test('returns 6 for fatal', () => {
    expect(processLogLevel('fatal')).toBe(6)
  })

  test('is case-insensitive', () => {
    expect(processLogLevel('ERROR')).toBe(5)
    expect(processLogLevel('Info')).toBe(3)
  })

  test('throws for unknown log level', () => {
    expect(() => processLogLevel('unknown')).toThrow(/Unknown log level/)
  })
})
