import CompactGroupByRunPerLevelRepresentation from '../../src/representations/CompactGroupByRunPerLevelRepresentation';
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

describe('(unit): CompactGroupByRunPerLevelRepresentation', (): void => {
  describe('compose()', (): void => {
    test('should return "No vulnerabilities found" when there are no runs', (): void => {
      const repr = new CompactGroupByRunPerLevelRepresentation(buildModel([], []));
      expect(repr.compose()).toBe('No vulnerabilities found');
    })

    test('should return group header with "No vulnerabilities found" when run has no findings', (): void => {
      const repr = new CompactGroupByRunPerLevelRepresentation(
        buildModel([{ id: 1, toolName: 'Grype' }], []),
      );
      expect(repr.compose()).toBe('_[Run 1]_ *Grype*\nNo vulnerabilities found');
    })

    test('should compose single finding with correct level label', (): void => {
      const repr = new CompactGroupByRunPerLevelRepresentation(
        buildModel(
          [{ id: 1, toolName: 'Grype' }],
          [mockFinding({ runId: 1, level: SecurityLevel.Error })],
        ),
      );
      expect(repr.compose()).toBe('_[Run 1]_ *Grype*\n*Error*: 1');
    })

    test('should group and sort findings by level descending', (): void => {
      const findings = [
        mockFinding({ runId: 1, level: SecurityLevel.Note }),
        mockFinding({ runId: 1, level: SecurityLevel.Error }),
        mockFinding({ runId: 1, level: SecurityLevel.Warning }),
        mockFinding({ runId: 1, level: SecurityLevel.Warning }),
      ];
      const repr = new CompactGroupByRunPerLevelRepresentation(
        buildModel([{ id: 1, toolName: 'Trivy' }], findings),
      );
      expect(repr.compose()).toBe('_[Run 1]_ *Trivy*\n*Error*: 1, *Warning*: 2, *Note*: 1');
    })

    test('should compose multiple runs each with their own findings', (): void => {
      const findings = [
        mockFinding({ runId: 1, level: SecurityLevel.Error }),
        mockFinding({ runId: 2, level: SecurityLevel.Warning }),
      ];
      const repr = new CompactGroupByRunPerLevelRepresentation(
        buildModel(
          [{ id: 1, toolName: 'Grype' }, { id: 2, toolName: 'Trivy' }],
          findings,
        ),
      );
      expect(repr.compose()).toBe(
        '_[Run 1]_ *Grype*\n*Error*: 1\n\n_[Run 2]_ *Trivy*\n*Warning*: 1',
      )
    })

    test('should show "No vulnerabilities found" for a run that has no matching findings', (): void => {
      const findings = [mockFinding({ runId: 1, level: SecurityLevel.Error })];
      const repr = new CompactGroupByRunPerLevelRepresentation(
        buildModel(
          [{ id: 1, toolName: 'Grype' }, { id: 2, toolName: 'Trivy' }],
          findings,
        ),
      );
      expect(repr.compose()).toBe(
        '_[Run 1]_ *Grype*\n*Error*: 1\n\n_[Run 2]_ *Trivy*\nNo vulnerabilities found',
      )
    })

    test('should handle all level variants correctly', (): void => {
      const findings = [
        mockFinding({ runId: 1, level: SecurityLevel.Error }),
        mockFinding({ runId: 1, level: SecurityLevel.Warning }),
        mockFinding({ runId: 1, level: SecurityLevel.Note }),
        mockFinding({ runId: 1, level: SecurityLevel.None }),
        mockFinding({ runId: 1, level: SecurityLevel.Unknown }),
      ];
      const repr = new CompactGroupByRunPerLevelRepresentation(
        buildModel([{ id: 1, toolName: 'Scanner' }], findings),
      );
      expect(repr.compose()).toBe(
        '_[Run 1]_ *Scanner*\n*Error*: 1, *Warning*: 1, *Note*: 1, *None*: 1, *Unknown*: 1',
      );
    })
  })
})
