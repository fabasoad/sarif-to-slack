import CompactGroupBySarifPerSeverityRepresentation from '../../src/representations/CompactGroupBySarifPerSeverityRepresentation';
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

describe('(unit): CompactGroupBySarifPerSeverityRepresentation', (): void => {
  describe('compose()', (): void => {
    test('should return "No vulnerabilities found" when there are no sarif files', (): void => {
      const repr = new CompactGroupBySarifPerSeverityRepresentation(buildModel([], []));
      expect(repr.compose()).toBe('No vulnerabilities found');
    })

    test('should return group header with "No vulnerabilities found" when file has no findings', (): void => {
      const repr = new CompactGroupBySarifPerSeverityRepresentation(
        buildModel(['/path/to/results.sarif'], []),
      );
      expect(repr.compose()).toBe('_[File 1]_ *results.sarif*\nNo vulnerabilities found');
    })

    test('should compose single finding with correct severity label', (): void => {
      const repr = new CompactGroupBySarifPerSeverityRepresentation(
        buildModel(
          ['/path/to/grype.sarif'],
          [mockFinding({ sarifPath: '/path/to/grype.sarif', severity: SecuritySeverity.Critical })],
        ),
      );
      expect(repr.compose()).toBe('_[File 1]_ *grype.sarif*\n*Critical*: 1');
    })

    test('should group and sort findings by severity descending', (): void => {
      const sarifPath = '/scans/results.sarif';
      const findings = [
        mockFinding({ sarifPath, severity: SecuritySeverity.Low }),
        mockFinding({ sarifPath, severity: SecuritySeverity.Critical }),
        mockFinding({ sarifPath, severity: SecuritySeverity.High }),
        mockFinding({ sarifPath, severity: SecuritySeverity.High }),
      ];
      const repr = new CompactGroupBySarifPerSeverityRepresentation(
        buildModel([sarifPath], findings),
      );
      expect(repr.compose()).toBe('_[File 1]_ *results.sarif*\n*Critical*: 1, *High*: 2, *Low*: 1');
    })

    test('should compose multiple sarif files with incrementing indices', (): void => {
      const file1 = '/scans/grype-01.sarif';
      const file2 = '/scans/grype-02.sarif';
      const findings = [
        mockFinding({ sarifPath: file1, severity: SecuritySeverity.High }),
        mockFinding({ sarifPath: file2, severity: SecuritySeverity.Medium }),
      ];
      const repr = new CompactGroupBySarifPerSeverityRepresentation(
        buildModel([file1, file2], findings),
      );
      expect(repr.compose()).toBe(
        '_[File 1]_ *grype-01.sarif*\n*High*: 1\n\n_[File 2]_ *grype-02.sarif*\n*Medium*: 1',
      );
    })

    test('should show "No vulnerabilities found" for a file that has no matching findings', (): void => {
      const file1 = '/scans/grype-01.sarif';
      const file2 = '/scans/grype-02.sarif';
      const findings = [mockFinding({ sarifPath: file1, severity: SecuritySeverity.Critical })];
      const repr = new CompactGroupBySarifPerSeverityRepresentation(
        buildModel([file1, file2], findings),
      );
      expect(repr.compose()).toBe(
        '_[File 1]_ *grype-01.sarif*\n*Critical*: 1\n\n_[File 2]_ *grype-02.sarif*\nNo vulnerabilities found',
      );
    })

    test('should use only basename for the group title', (): void => {
      const sarifPath = '/very/long/path/to/nested/scan-results.sarif';
      const repr = new CompactGroupBySarifPerSeverityRepresentation(
        buildModel(
          [sarifPath],
          [mockFinding({ sarifPath, severity: SecuritySeverity.Medium })],
        ),
      );
      expect(repr.compose()).toBe('_[File 1]_ *scan-results.sarif*\n*Medium*: 1');
    })

    test('should handle all severity variants correctly', (): void => {
      const sarifPath = '/scans/all-severities.sarif';
      const findings = [
        mockFinding({ sarifPath, severity: SecuritySeverity.Critical }),
        mockFinding({ sarifPath, severity: SecuritySeverity.High }),
        mockFinding({ sarifPath, severity: SecuritySeverity.Medium }),
        mockFinding({ sarifPath, severity: SecuritySeverity.Low }),
        mockFinding({ sarifPath, severity: SecuritySeverity.None }),
        mockFinding({ sarifPath, severity: SecuritySeverity.Unknown }),
      ];
      const repr = new CompactGroupBySarifPerSeverityRepresentation(
        buildModel([sarifPath], findings),
      );
      expect(repr.compose()).toBe(
        '_[File 1]_ *all-severities.sarif*\n*Critical*: 1, *High*: 1, *Medium*: 1, *Low*: 1, *None*: 1, *Unknown*: 1',
      );
    })
  })
})
