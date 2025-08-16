/**
 * This enum represents the condition on when message should be sent. If this
 * condition is satisfied then message is sent, otherwise - message is not sent.
 * @public
 */
export enum SendIf {
  /**
   * Send message only if there is at least one finding with "Critical" severity.
   * Since it is the higher possible severity, it is the same as "Critical" or
   * higher.
   */
  SeverityCritical,
  /**
   * Send message only if there is at least one finding with "High" severity.
   */
  SeverityHigh,
  /**
   * Send message only if there is at least one finding with "High" severity or
   * higher, that includes "High" and "Critical".
   */
  SeverityHighOrHigher,
  /**
   * Send message only if there is at least one finding with "Medium" severity.
   */
  SeverityMedium,
  /**
   * Send message only if there is at least one finding with "Medium" severity
   * or higher, that includes "Medium", "High" and "Critical".
   */
  SeverityMediumOrHigher,
  /**
   * Send message only if there is at least one finding with "Low" severity.
   */
  SeverityLow,
  /**
   * Send message only if there is at least one finding with "Low" severity or
   * higher, that includes "Low", "Medium", "High" and "Critical".
   */
  SeverityLowOrHigher,
  /**
   * Send message only if there is at least one finding with "None" severity.
   */
  SeverityNone,
  /**
   * Send message only if there is at least one finding with "None" severity or
   * higher, that includes "None", "Low", "Medium", "High" and "Critical".
   */
  SeverityNoneOrHigher,
  /**
   * Send message only if there is at least one finding with "Unknown" severity.
   */
  SeverityUnknown,
  /**
   * Send message only if there is at least one finding with "Unknown" severity
   * or higher, that includes "Unknown", "None", "Low", "Medium", "High" and "Critical".
   */
  SeverityUnknownOrHigher,
  /**
   * Send message only if there is at least one finding with "Error" level.
   * Since it is the higher possible level, it is the same as "Error" or higher.
   */
  LevelError,
  /**
   * Send message only if there is at least one finding with "Warning" level.
   */
  LevelWarning,
  /**
   * Send message only if there is at least one finding with "Warning" level or
   * higher, that includes "Warning" and "Error".
   */
  LevelWarningOrHigher,
  /**
   * Send message only if there is at least one finding with "Note" level.
   */
  LevelNote,
  /**
   * Send message only if there is at least one finding with "Note" level or
   * higher, that includes "Note", "Warning" and "Error.
   */
  LevelNoteOrHigher,
  /**
   * Send message only if there is at least one finding with "None" level.
   */
  LevelNone,
  /**
   * Send message only if there is at least one finding with "None" level or
   * higher, that includes "None", "Note", "Warning" and "Error.
   */
  LevelNoneOrHigher,
  /**
   * Send message only if there is at least one finding with "Unknown" level.
   */
  LevelUnknown,
  /**
   * Send message only if there is at least one finding with "Unknown" level or
   * higher, that includes "Unknown", "None", "Note", "Warning" and "Error.
   */
  LevelUnknownOrHigher,
  /**
   * Always send a message.
   */
  Always,
  /**
   * Send a message if at least 1 vulnerability is found.
   */
  Some,
  /**
   * Send a message only if no vulnerabilities are found.
   */
  Empty,
  /**
   * Never send a message.
   */
  Never,
}

/**
 * Returns log message based on the provided {@param sendIf} parameter.
 * @param sendIf An instance of {@link SendIf} enum.
 * @internal
 */
export function sendIfLogMessage(sendIf: SendIf): string {
  switch (sendIf) {
    case SendIf.SeverityCritical:
      return 'No message sent: no findings with "Critical" severity.'
    case SendIf.SeverityHigh:
      return 'No message sent: no findings with "High" severity.'
    case SendIf.SeverityHighOrHigher:
      return 'No message sent: no findings with "High" or higher severity.'
    case SendIf.SeverityMedium:
      return 'No message sent: no findings with "Medium" severity.'
    case SendIf.SeverityMediumOrHigher:
      return 'No message sent: no findings with "Medium" or higher severity.'
    case SendIf.SeverityLow:
      return 'No message sent: no findings with "Low" severity.'
    case SendIf.SeverityLowOrHigher:
      return 'No message sent: no findings with "Low" or higher severity.'
    case SendIf.SeverityNone:
      return 'No message sent: no findings with "None" severity.'
    case SendIf.SeverityNoneOrHigher:
      return 'No message sent: no findings with "None" or higher severity.'
    case SendIf.SeverityUnknown:
      return 'No message sent: no findings with "Unknown" severity.'
    case SendIf.SeverityUnknownOrHigher:
      return 'No message sent: no findings with "Unknown" or higher severity.'
    case SendIf.LevelError:
      return 'No message sent: no findings with "Error" level.'
    case SendIf.LevelWarning:
      return 'No message sent: no findings with "Warning" level.'
    case SendIf.LevelWarningOrHigher:
      return 'No message sent: no findings with "Warning" or higher level.'
    case SendIf.LevelNote:
      return 'No message sent: no findings with "Note" level.'
    case SendIf.LevelNoteOrHigher:
      return 'No message sent: no findings with "Note" or higher level.'
    case SendIf.LevelNone:
      return 'No message sent: no findings with "None" level.'
    case SendIf.LevelNoneOrHigher:
      return 'No message sent: no findings with "None" or higher level.'
    case SendIf.LevelUnknown:
      return 'No message sent: no findings with "Unknown" level.'
    case SendIf.LevelUnknownOrHigher:
      return 'No message sent: no findings with "Unknown" or higher level.'
    case SendIf.Always:
      return 'Message always sent.'
    case SendIf.Some:
      return 'No message sent: findings are not found.'
    case SendIf.Empty:
      return 'No message sent: some findings are found.'
    case SendIf.Never:
      return 'No message sent: sending is disabled.'
    default:
      return 'Unknown SendIf value.'
  }
}
