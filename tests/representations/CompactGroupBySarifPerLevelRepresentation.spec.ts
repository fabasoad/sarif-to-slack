import CompactGroupBySarifPerLevelRepresentation from '../../src/representations/CompactGroupBySarifPerLevelRepresentation';
import FindingArray from '../../src/model/FindingArray';
import type Finding from '../../src/model/Finding';
import { SecurityLevel, SecuritySeverity } from '../../src/types';
import type { RunData, SarifModel } from '../../src/types';

function mockFinding(opts: {
  sarifPath?: string,
  runId?: number,
  toolName?: string,
  level?: SecurityLevel,
  severity?: SecuritySeverity,
}): Finding {
  const finding: Finding = {
    get sarifPath() { return opts.sarifPath ?? '/default.sarif' },
    get runId() { return opts.runId ?? 1 },
    get toolName() { return opts.toolName ?? 'Tool' },
    get cvssScore() { return undefined },
    get level() { return opts.level ?? SecurityLevel.Unknown },
    get severity() { return opts.severity ?? SecuritySeverity.Unknown },
    clone() { return mockFinding(opts) },
  };
  return finding;
}

function buildModel(
  sarifFiles: string[],
  findings: Finding[],
): SarifModel {
  const arr = new FindingArray();
  findings.forEach(f => arr.push(f));
  return {
    sarifFiles,
    runs: [{ id: 1, toolName: 'Tool', run: {} as RunData['run'] }],
    findings: arr,
  };
}

describe('(unit): CompactGroupBySarifPerLevelRepresentation', (): void => {
  describe('compose()', (): void => {
    test('should return "No vulnerabilities found" when there are no sarif files', (): void => {
      const repr = new CompactGroupBySarifPerLevelRepresentation(buildModel([], []));
      expect(repr.compose()).toBe('No vulnerabilities found');
    })

    test('should return group header with "No vulnerabilities found" when file has no findings', (): void => {
      const repr = new CompactGroupBySarifPerLevelRepresentation(
        buildModel(['/path/to/results.sarif'], []),
      );
      expect(repr.compose()).toBe('_[File 1]_ *results.sarif*\nNo vulnerabilities found');
    })

    test('should compose single finding with correct level label', (): void => {
      const repr = new CompactGroupBySarifPerLevelRepresentation(
        buildModel(
          ['/path/to/grype.sarif'],
          [mockFinding({ sarifPath: '/path/to/grype.sarif', level: SecurityLevel.Error })],
        ),
      );
      expect(repr.compose()).toBe('_[File 1]_ *grype.sarif*\n*Error*: 1');
    })

    test('should group and sort findings by level descending', (): void => {
      const sarifPath = '/scans/results.sarif';
      const findings = [
        mockFinding({ sarifPath, level: SecurityLevel.Note }),
        mockFinding({ sarifPath, level: SecurityLevel.Error }),
        mockFinding({ sarifPath, level: SecurityLevel.Warning }),
        mockFinding({ sarifPath, level: SecurityLevel.Warning }),
      ];
      const repr = new CompactGroupBySarifPerLevelRepresentation(
        buildModel([sarifPath], findings),
      );
      expect(repr.compose()).toBe('_[File 1]_ *results.sarif*\n*Error*: 1, *Warning*: 2, *Note*: 1');
    })

    test('should compose multiple sarif files with incrementing indices', (): void => {
      const file1 = '/scans/grype-01.sarif';
      const file2 = '/scans/grype-02.sarif';
      const findings = [
        mockFinding({ sarifPath: file1, level: SecurityLevel.Error }),
        mockFinding({ sarifPath: file2, level: SecurityLevel.Warning }),
      ];
      const repr = new CompactGroupBySarifPerLevelRepresentation(
        buildModel([file1, file2], findings),
      );
      expect(repr.compose()).toBe(
        '_[File 1]_ *grype-01.sarif*\n*Error*: 1\n\n_[File 2]_ *grype-02.sarif*\n*Warning*: 1',
      );
    })

    test('should show "No vulnerabilities found" for a file that has no matching findings', (): void => {
      const file1 = '/scans/grype-01.sarif';
      const file2 = '/scans/grype-02.sarif';
      const findings = [mockFinding({ sarifPath: file1, level: SecurityLevel.Error })];
      const repr = new CompactGroupBySarifPerLevelRepresentation(
        buildModel([file1, file2], findings),
      );
      expect(repr.compose()).toBe(
        '_[File 1]_ *grype-01.sarif*\n*Error*: 1\n\n_[File 2]_ *grype-02.sarif*\nNo vulnerabilities found',
      );
    })

    test('should use only basename for the group title', (): void => {
      const sarifPath = '/very/long/path/to/nested/scan-results.sarif';
      const repr = new CompactGroupBySarifPerLevelRepresentation(
        buildModel(
          [sarifPath],
          [mockFinding({ sarifPath, level: SecurityLevel.Note })],
        ),
      );
      expect(repr.compose()).toBe('_[File 1]_ *scan-results.sarif*\n*Note*: 1');
    })

    test('should handle all level variants correctly', (): void => {
      const sarifPath = '/scans/all-levels.sarif';
      const findings = [
        mockFinding({ sarifPath, level: SecurityLevel.Error }),
        mockFinding({ sarifPath, level: SecurityLevel.Warning }),
        mockFinding({ sarifPath, level: SecurityLevel.Note }),
        mockFinding({ sarifPath, level: SecurityLevel.None }),
        mockFinding({ sarifPath, level: SecurityLevel.Unknown }),
      ];
      const repr = new CompactGroupBySarifPerLevelRepresentation(
        buildModel([sarifPath], findings),
      );
      expect(repr.compose()).toBe(
        '_[File 1]_ *all-levels.sarif*\n*Error*: 1, *Warning*: 1, *Note*: 1, *None*: 1, *Unknown*: 1',
      );
    })
  })
})
