import { SarifToSlackService } from '../../src'
import { CalculateResultsBy, GroupResultsBy } from '../../src/types'

describe('(integration): SendSarifToSlack', () => {
  test('Should send Sarif to Slack', async () => {
    const sarifToSlackService: SarifToSlackService = await SarifToSlackService.create({
      webhookUrl: process.env.SARIF_TO_SLACK_WEBHOOK_URL as string,
      username: process.env.SARIF_TO_SLACK_USERNAME,
      iconUrl: process.env.SARIF_TO_SLACK_ICON_URL,
      color: process.env.SARIF_TO_SLACK_COLOR,
      sarifPath: `./test-data/sarif/${process.env.SARIF_TO_SLACK_SARIF_FILE_NAME}`,
      logLevel: process.env.SARIF_TO_SLACK_LOG_LEVEL,
      header: {
        include: process.env.SARIF_TO_SLACK_HEADER !== 'skip',
        value: process.env.SARIF_TO_SLACK_HEADER,
      },
      footer: {
        include: process.env.SARIF_TO_SLACK_FOOTER !== 'skip',
        value: process.env.SARIF_TO_SLACK_FOOTER,
      },
      actor: {
        include: process.env.SARIF_TO_SLACK_ACTOR !== 'skip',
        value: process.env.SARIF_TO_SLACK_ACTOR,
      },
      run: {
        include: Boolean(process.env.SARIF_TO_SLACK_INCLUDE_RUN),
      },
      output: {
        groupBy: process.env.SARIF_TO_SLACK_GROUP_BY === 'Tool name'
          ? GroupResultsBy.ToolName : GroupResultsBy.None,
        calculateBy: process.env.SARIF_TO_SLACK_CALCULATE_BY === 'Level'
          ? CalculateResultsBy.Level : CalculateResultsBy.Severity,
      }
    })
    await sarifToSlackService.sendAll()
  })
})
