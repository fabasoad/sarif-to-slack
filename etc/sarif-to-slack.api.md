## API Report File for "@fabasoad/sarif-to-slack"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import type { Log } from 'sarif';

// @public
export enum CalculateResultsBy {
    Level = 0,
    Severity = 1
}

// @public
export type FooterOptions = IncludeAwareWithValueOptions & {
    type?: FooterType;
};

// @public
export enum FooterType {
    Markdown = "mrkdwn",
    PlainText = "plain_text"
}

// @public
export enum GroupResultsBy {
    Run = 1,
    ToolName = 0,
    Total = 2
}

// @public
export type IncludeAwareOptions = {
    include: boolean;
};

// @public
export type IncludeAwareWithValueOptions = IncludeAwareOptions & {
    value?: string;
};

// @public
export enum LogLevel {
    Debug = 2,
    Error = 5,
    Fatal = 6,
    Info = 3,
    Silly = 0,
    Trace = 1,
    Warning = 4
}

// @public
export type LogOptions = {
    level?: LogLevel;
    template?: string;
    colored?: boolean;
};

// @public
export type SarifLog = Log;

// @public
export type SarifToSlackOutput = {
    groupBy?: GroupResultsBy;
    calculateBy?: CalculateResultsBy;
};

// @public
export class SarifToSlackService {
    static create(opts: SarifToSlackServiceOptions): Promise<SarifToSlackService>;
    send(sarifPath: string): Promise<void>;
    sendAll(): Promise<void>;
    get slackMessages(): ReadonlyMap<string, SlackMessage>;
}

// @public
export type SarifToSlackServiceOptions = {
    webhookUrl: string;
    sarifPath: string;
    username?: string;
    iconUrl?: string;
    color?: string;
    log?: LogOptions;
    header?: IncludeAwareWithValueOptions;
    footer?: FooterOptions;
    actor?: IncludeAwareWithValueOptions;
    run?: IncludeAwareOptions;
    output?: SarifToSlackOutput;
};

// @public
export interface SlackMessage {
    sarif: SarifLog;
    send: () => Promise<string>;
}

```
