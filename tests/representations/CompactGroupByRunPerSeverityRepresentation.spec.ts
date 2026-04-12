import CompactGroupByRunPerSeverityRepresentation from '../../src/representations/CompactGroupByRunPerSeverityRepresentation';
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
  runs: Array<{ id: number; toolName: string }>,
  findings: Finding[],
): SarifModel {
  const arr = new FindingArray();
  findings.forEach(f => arr.push(f));
  return {
    sarifFiles: [],
    runs: runs.map(r => ({ id: r.id, toolName: r.toolName, run: {} as RunData['run'] })),
    findings: arr,
  };
}

describe('(unit): CompactGroupByRunPerSeverityRepresentation', (): void => {
  describe('compose()', (): void => {
    test('should return "No vulnerabilities found" when there are no runs', (): void => {
      const repr = new CompactGroupByRunPerSeverityRepresentation(buildModel([], []));
      expect(repr.compose()).toBe('No vulnerabilities found');
    })

    test('should return group header with "No vulnerabilities found" when run has no findings', (): void => {
      const repr = new CompactGroupByRunPerSeverityRepresentation(
        buildModel([{ id: 1, toolName: 'Grype' }], []),
      );
      expect(repr.compose()).toBe('_[Run 1]_ *Grype*\nNo vulnerabilities found');
    })

    test('should compose single finding with correct severity label', (): void => {
      const repr = new CompactGroupByRunPerSeverityRepresentation(
        buildModel(
          [{ id: 1, toolName: 'Grype' }],
          [mockFinding({ runId: 1, severity: SecuritySeverity.Critical })],
        ),
      );
      expect(repr.compose()).toBe('_[Run 1]_ *Grype*\n*Critical*: 1');
    })

    test('should group and sort findings by severity descending', (): void => {
      const findings = [
        mockFinding({ runId: 1, severity: SecuritySeverity.Low }),
        mockFinding({ runId: 1, severity: SecuritySeverity.Critical }),
        mockFinding({ runId: 1, severity: SecuritySeverity.High }),
        mockFinding({ runId: 1, severity: SecuritySeverity.High }),
      ];
      const repr = new CompactGroupByRunPerSeverityRepresentation(
        buildModel([{ id: 1, toolName: 'Trivy' }], findings),
      );
      expect(repr.compose()).toBe('_[Run 1]_ *Trivy*\n*Critical*: 1, *High*: 2, *Low*: 1');
    })

    test('should compose multiple runs each with their own findings', (): void => {
      const findings = [
        mockFinding({ runId: 1, severity: SecuritySeverity.High }),
        mockFinding({ runId: 2, severity: SecuritySeverity.Medium }),
      ];
      const repr = new CompactGroupByRunPerSeverityRepresentation(
        buildModel(
          [{ id: 1, toolName: 'Grype' }, { id: 2, toolName: 'Trivy' }],
          findings,
        ),
      );
      expect(repr.compose()).toBe(
        '_[Run 1]_ *Grype*\n*High*: 1\n\n_[Run 2]_ *Trivy*\n*Medium*: 1',
      );
    })

    test('should show "No vulnerabilities found" for a run that has no matching findings', (): void => {
      const findings = [mockFinding({ runId: 1, severity: SecuritySeverity.Critical })];
      const repr = new CompactGroupByRunPerSeverityRepresentation(
        buildModel(
          [{ id: 1, toolName: 'Grype' }, { id: 2, toolName: 'Trivy' }],
          findings,
        ),
      );
      expect(repr.compose()).toBe(
        '_[Run 1]_ *Grype*\n*Critical*: 1\n\n_[Run 2]_ *Trivy*\nNo vulnerabilities found',
      );
    })

    test('should handle all severity variants correctly', (): void => {
      const findings = [
        mockFinding({ runId: 1, severity: SecuritySeverity.Critical }),
        mockFinding({ runId: 1, severity: SecuritySeverity.High }),
        mockFinding({ runId: 1, severity: SecuritySeverity.Medium }),
        mockFinding({ runId: 1, severity: SecuritySeverity.Low }),
        mockFinding({ runId: 1, severity: SecuritySeverity.None }),
        mockFinding({ runId: 1, severity: SecuritySeverity.Unknown }),
      ];
      const repr = new CompactGroupByRunPerSeverityRepresentation(
        buildModel([{ id: 1, toolName: 'Scanner' }], findings),
      );
      expect(repr.compose()).toBe(
        '_[Run 1]_ *Scanner*\n*Critical*: 1, *High*: 1, *Medium*: 1, *Low*: 1, *None*: 1, *Unknown*: 1',
      );
    })
  })
})
